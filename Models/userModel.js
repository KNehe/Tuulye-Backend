import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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
    }
});

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){ next(); }

    this.password = await bcrypt.hash(this.password,12)
    
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

const User = mongoose.model('User',userSchema);

export default User;