import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const Register = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,[e.target.id]:e.target.value.trim()
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.username || !formData.password) {
      return setErrorMessage('All fields are required');
      
    }
    try {
      setLoading(true);
      setErrorMessage(null);  
      const res = await fetch('/api/auth/register',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success===false) {
        return setErrorMessage(data.errorMessage)
      }
      setLoading(false);
      if (res.ok) {
        navigate('/login');
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className=' mx-auto max-w-xl p-3'>
      <h1 className='px-3 text-3xl text-center py-3  m-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg '>Register</h1>
        <div className='flex-1 items-center'>
          <form className='flex flex-col gap-4' action="" onSubmit={handleSubmit}>
            <div >
              <Label className='text-white' value='UserName'/>
              <TextInput type='text' placeholder='username' id='username' onChange={handleChange}/>
            </div>
            <div >
              <Label value='Email'/>
              <TextInput type='email' placeholder='email' id='email' onChange={handleChange}/>
            </div>
            <div >
              <Label value='Password'/>
              <TextInput type='password' placeholder='password' id='password' onChange={handleChange}/>
            </div>
            <Button className=' max-w-xs ml-auto mr-auto' gradientDuoTone="purpleToBlue" outline type='submit' disabled={loading}>{
              loading ? (
                <>
                <Spinner size="sm"/>
                  <span className='pl-3'>Loading...</span>
                
                </>
              ) : 'Register'
            }
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5 '>
            <span>Have an account?</span>
            <Link to={'/login'} className='text-blue-500'>Login</Link>
          </div>
          {errorMessage && <Alert className='mt-5' color="failure">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  )
}

export default Register