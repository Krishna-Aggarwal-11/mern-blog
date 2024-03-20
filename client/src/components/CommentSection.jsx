import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link , useNavigate } from "react-router-dom";
import { Alert, Button, Textarea , Modal } from "flowbite-react";
import Comment from "./Comment.jsx";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ commentToDelete , setCommentToDlete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([...comments, data]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComment/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);


  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map((comment) => 
          (comment._id === commentId) ?
            {...comment, likes: data.likes,numberOfLikes: data.numberOfLikes} :
            comment

        ))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleEdit = async (comment , editedContent) => {
    setComments(
      comments.map((c) => (c._id === comment._id) ? {...c, content: editedContent} : c)
    )
  }

  const handleDelete = async (commentId) => {
    setShowModal(false)
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
            setComments(comments.filter((comment) =>comment._id !== commentId))
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as :</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePic}
            alt=""
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-sm text-red-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/login"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Write a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-3">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 my-5">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comment</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm ">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment  key={comment._id} comment={comment} onLike ={handleLike} onEdit={handleEdit} onDelete={(commentId)=>{
              setShowModal(true)
              setCommentToDlete(commentId)
            }}/>
          ))}
        </>
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
              Are you sure you want to delete your comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
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

export default CommentSection;