import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A meal must have a name"],
        unique:true
    },
    price:{
        type:Number,
        required:[true,"A meal must have a price"]
    },
    image:{
        type:String,
        required:[true,"A meal must have an image"]
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false,
    }
});

const Meal = mongoose.model("Meal",mealSchema);

export default Meal;