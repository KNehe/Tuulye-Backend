import User from "./../Models/userModel";
import CatchAsync from "./../Utils/catchAsync";
import jwt from 'jsonwebtoken';
import AppError from './../Utils/appError';
import {promisify} from 'util';
import sendEmail from './../Utils/email';
import crypto from 'crypto';

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
        gender:req.body.gender,
        passwordChangedAt:req.body.passwordChangedAt
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

const protect = CatchAsync( async(req,res,next) =>{

    //check if token exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1];   
    }

    if(!token){
        return next(new AppError("You are not logged in,please log in", 401));
    }
    //verify the token
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    //check if user still exists
    const currentUser = await User.findById(decodedToken.id);
    
    if(!currentUser){
        return next( new AppError("The user belonging to the token does not exist",401))
    }
    //check if user changed password after token was issued
    // if(currentUser.changedPasswordAfter(decodedToken.iat))
    // {
    //     return next(new AppError("Password was changed"),401);
    // }

    req.user = currentUser;
    //grant access
    next();

});


const restrictTo = (...roles) =>{

    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError("You have no permission to perform this action"));
        }
        next();
    };
};

const fogotPassword = CatchAsync( async(req,res,next)=>{
    //get used based on posted email
    
    const user = await User.findOne({ email: req.body.email});
    if(!user){
        return next(new AppError("No user with that email", 404));
    }
    //generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave:false});

    //send it to user's email
    const resetUrl = `${req.protocol}://${req.get('host')}//api/v1/users/resetPassword/${resetToken}`;

    const message =    `Forgot your password? Submit a patch request qith your new password to ${resetUrl} \n 
    If you dint forget password please ignore this email`;

    try{await sendEmail({
        email:user.email,
        subject:'Your password reset token(Valid for 10 mins)',
        message
    });

    res.status(200).json({
        status:"success",
        message:"Token sent to email"
    });
   }catch(err)
   {
       user.passwordResetToken = undefined;
       user.passwordResetExpires = undefined;
       await user.save({ validateBeforeSave:false});

       return new AppError("There was an error sending the email",500);
   }

});

const resetPassword = CatchAsync( async (req,res,next)=>{

    //get user based on token
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    //set the new password if token has not expired and there is a user
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{ $gt: Date.now()}});

    //update the changeAtPassword property for current user
    if(!user){
        return new AppError("Token expired or invalid", 400);
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //log the user in
    const token = signToken(user._id);
    res.status(200).json({
        status:"success",
        token
    });
});

export default {signUp,logIn,protect,restrictTo,fogotPassword,resetPassword};


