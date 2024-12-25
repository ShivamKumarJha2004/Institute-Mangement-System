import express from "express";
import {signup} from "../Controller/UserController.js";
import { login } from "../Controller/UserController.js";
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);

export default router;
