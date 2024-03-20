import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table,Modal,Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState("");
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/posts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchPost();
  }, [currentUser._id]);

  const handleShowMore = async() => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/posts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.lenght < 9) {
          setShowMore(false); 
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/delete/${deletePostId}/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.errorMessage)
      }else{
        setUserPosts((prev)=>prev.filter((post) => post._id !== deletePostId));
      }
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-sky-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>DATE UPDATED</Table.HeadCell>
              <Table.HeadCell>POST IMAGE </Table.HeadCell>
              <Table.HeadCell>POST TITLE </Table.HeadCell>
              <Table.HeadCell>CATEGORY</Table.HeadCell>
              <Table.HeadCell>DELETE</Table.HeadCell>
              <Table.HeadCell>
                <span>EDIT</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="text-gray-500 font-medium dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell><span className="text-red-500 font-medium hover:underline cursor-pointer" onClick={() => {
                    setShowModal(true);
                    setDeletePostId(post._id);
                  }}>Delete</span></Table.Cell>
                  <Table.Cell><Link className="text-blue-500 hover:underline cursor-pointer" to={`/update-post/${post._id}`}><span>Edit</span></Link></Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && <button onClick={handleShowMore} className="text-blue-500 hover:underline w-full self-center text-sm py-7 cursor-pointer">Show more</button>
          }
        </>
      ) : (
        <p>No posts</p>
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
              Are you sure you want to delete your post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPost;
