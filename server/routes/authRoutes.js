import express from 'express';
import { Login, Register, google } from '../controller/authController.js';


const router = express.Router();

router.post('/register',Register);
router.post('/login',Login);
router.post('/google',google);

export default router;