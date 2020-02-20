import User from "./../Models/userModel";
import CatchAsync from "./../Utils/catchAsync";
import jwt from 'jsonwebtoken';
import AppError from './../Utils/appError';

const signToken = (id)=>{
    return jwt.sign({ id: id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const signUp = CatchAsync(async (req,res,next)=>{

    const newUser = await User.create({
        name: req.body.name,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        password:req.body.password,
        gender:req.body.gender
    });
    
    const token = signToken(newUser._id);

    res.status(200).json({
        status:"success",
        token,
        data:{
            user:newUser
        }
    });

});

const logIn = CatchAsync( async (req,res,next) =>{

    const {email,password} = req.body;

    //if email and password exit
    if(!email || !password){
        return next(new AppError("Please provide email and password",400));
    }
    //check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError("Incorrect Email or password",401));
    }

    //send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status:"success",
        token
    });
    

});

export default {signUp,logIn};


