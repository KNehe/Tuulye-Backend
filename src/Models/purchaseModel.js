import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
    network:{
        type:String,
        required:[true,'A network is required']
    },
    pin:{
        type:String,
        required:[true,'A pin is required']
    },
    phone:{
        type:String,
        required:[true, 'A phone number is required']
    },
    purchasedBy:{
        type:String,
        required:[true, 'User Id is required']
    },
    deliveryStatus:{
        type:Boolean,
        default:false
    },
    deliveryDate:Date

});

const PurchaseModel = mongoose.model('Purchase',PurchaseSchema);

export default PurchaseModel;