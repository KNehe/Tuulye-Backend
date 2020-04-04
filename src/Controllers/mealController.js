import Meal from '../Models/mealModel';
import CatchAsync from '../Utils/catchAsync';
import AppError from '../Utils/appError';
import Purchase from './../Models/purchaseModel';

const createMeal =  CatchAsync(async (req,res,next) =>{
    
    const newMeal = await Meal.create({
        name: req.body.name,
        price:req.body.price,
        image:req.body.image
    });

    res.status(200).json({
        status:"success",
        data:{
            meal:newMeal
        }
    });

});


const getAllMeals =  CatchAsync(async(req,res,next) =>{

    if(!req.params.size || !req.params.page){
        return next(new AppError('Size and page required',500));
    }

    const size = parseInt(req.params.size);
    const pageNo = parseInt(req.params.page || 1);

    if(pageNo < 0 || pageNo === 0){
        return res.json({'error':true, 'message':'Invalid page number'});
    }

    const meals = await Meal.find()
                        .skip( (pageNo - 1) * size)
                        .limit(size);

    const totalNumberOfRecords = await Meal.find().countDocuments();

    res.status(200).json({
        status:"success",
        results:meals.length,
        data:{
            meals,
            currentPage : pageNo,
            pages: Math.ceil(totalNumberOfRecords / size)
            
        }
    });
});

const getOneMeal = CatchAsync(async(req,res,next) =>{

    const meal = await Meal.findById(req.params.id);

    if(!meal){
        return next(new AppError("Cant' find meal for ID provided",404));
    }

    res.status(200).json({
        status:"success",
        data:{
            meal
        }
    });
});

const updateMeal =  CatchAsync(async(req,res,next) =>{

    const meal = await Meal.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    if(!meal){
        return next(new AppError("Cant' find meal for ID provided",404));
    }

    res.status(200).json({
        status:"success",
        data:{
            meal
        }
    });
});

const deleteMeal =  CatchAsync(async(req,res,next) =>{

    const meals = await Meal.findByIdAndDelete(req.params.id);

    if(!meals){
        return next(new AppError("Cant' find meal for ID provided",404));
    }

    res.status(204).json({
        status:"success",
        data:null
    });
});

const payBill = CatchAsync(async(req,res,next)=>{
    
    if(!req.body.pin || !req.body.phone || req.network)
    {
        return next(new AppError('All credentials are required',400));
    }
    
    const purchase = Purchase.create({
        network:req.body.network,
        pin:req.body.pin,
        phone:req.body.phone,
        purchasedBy: req.user._id
    });

    res.status(200).json({
        status:'success',
        message:'Payment successfull',
        data:{purchase}
    });
});


export default {createMeal,getAllMeals,deleteMeal,updateMeal,getOneMeal,payBill};