import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table,Modal,Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck , FaTimes} from "react-icons/fa";

const DashUser = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/users`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchUser();
  }, [currentUser._id]);

  const handleShowMore = async() => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/users?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.lenght < 9) {
          setShowMore(false); 
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteUser = async () => {
      try{
        const res  = await fetch(`/api/user/delete/${deleteUserId}`,{
          method:'DELETE'
        })
        const data = await res.json()
        if(res.ok){
           setUsers((prev)=>prev.filter((user)=>user._id !== deleteUserId)) 
           setShowModal(false)
        }else{
          console.log(data.errorMessage)
        }
      }catch(error){
        console.log(error.message)
      }
  }
  


  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-sky-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>DATE created</Table.HeadCell>
              <Table.HeadCell>USER IMAGE </Table.HeadCell>
              <Table.HeadCell>Username </Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>DELETE</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date( user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                      <img src={user.profilePic} alt={user.username} className="w-10 h-10 object-cover bg-gray-500" />
                  </Table.Cell>
                  <Table.Cell>
                   {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? < FaCheck className="text-green-500"/> : <FaTimes className="text-red-500"/>}</Table.Cell>
                  <Table.Cell><span className="text-red-500 font-medium hover:underline cursor-pointer" onClick={() => {
                    setShowModal(true);
                    setDeleteUserId(user._id);
                  }}>Delete</span></Table.Cell>
                  
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && <button onClick={handleShowMore} className="text-blue-500 hover:underline w-full self-center text-sm py-7 cursor-pointer">Show more</button>
          }
        </>
      ) : (
        <p>No Users</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUser;
