import express from 'express';
import {createComment, getComments,likeComment, deleteComment,editComment , getComment} from '../controller/commentController.js';
import { verifyUser } from './../utils/verifyUser.js';


const router = express.Router();

router.post('/create',verifyUser,createComment);
router.get('/getComment/:postId',getComments);
router.put('/likeComment/:commentId', verifyUser, likeComment);
router.put('/editComment/:commentId', verifyUser, editComment);
router.delete('/deleteComment/:commentId', verifyUser, deleteComment);
router.get('/getcomments', verifyUser, getComment);

export default router;