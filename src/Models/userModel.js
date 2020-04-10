import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A name is required']
    },
    email:{
        type:String,
        required:[true,'An email is required'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Provide a valid email"]
    },
    phoneNumber:{
        type:String,
        required:[true, 'A phone number is required']
    },
    password:{
        type:String,
        required:[true,'A password is required'],
        minlength:6,
        select:false
    },
    gender:{
        type:String,
        required:[true,'Gender must be provided']
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:String,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
});

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){ next(); }

    this.password = await bcrypt.hash(this.password,12)
    
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = resetToken;
  
//   this.passwordResetToken = crypto
//   .createHash('sha256')
//   .update(resetToken)
//   .digest('hex');

  return resetToken;
};

const User = mongoose.model('User',userSchema);

export default User;