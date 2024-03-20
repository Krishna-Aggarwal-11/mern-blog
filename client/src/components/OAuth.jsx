import React from 'react'
import { Button } from 'flowbite-react';
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/user/userSlice.js';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = async() => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account",
        })
        try {
            const result = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    image:result.user.photoURL
                }),
            })
            const data = await res.json();
            console.log(data)
            if (res.ok) {
                dispatch(loginSuccess(data));
                navigate('/');
            }
        } catch (error) {
            
        }
    }
  return (
    <Button type='button' gradientDuoTone={"purpleToBlue"} outline onClick={handleClick}> 
    <AiFillGoogleCircle className='w-5 h-5 mr-2'/> Continue with Google
    </Button>
  )
}

export default OAuth