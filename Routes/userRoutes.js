import express from "express";
import authenticationController from "./../Controllers/authenticationController";


const router = express.Router();

router.post("/signup",authenticationController.signUp);
router.post("/login",authenticationController.logIn)

export default router;


