import express from "express";
import authenticationController from "./../Controllers/authenticationController";


const router = express.Router();

router.post("/signup",authenticationController.signUp);
router.post("/login",authenticationController.logIn);


router.post("/forgotPassword",authenticationController.fogotPassword);
router.patch("/resetPassword/:token",authenticationController.resetPassword);

export default router;


