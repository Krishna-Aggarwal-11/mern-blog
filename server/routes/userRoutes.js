import express from 'express';
import { test ,updateUser, deleteUser,logout, getUsers, getUser} from '../controller/userController.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test',test);
router.put("/update/:userId",verifyUser, updateUser);
router.delete("/delete/:userId",verifyUser, deleteUser);
router.post("/logout",logout);
router.get("/users",verifyUser, getUsers);
router.get("/:userId",verifyUser, getUser);


export default router;