import Meal from '../Models/mealModel';
import CatchAsync from '../Utils/catchAsync';
import AppError from '../Utils/appError';
import Purchase from './../Models/purchaseModel';

const createMeal =  CatchAsync(async (req,res,next) =>{
    
    const newMeal = await Meal.create(req.body);

    res.status(200).json({
        status:"success",
        data:{
            meal:newMeal
        }
    });

});


const getAllMeals =  CatchAsync(async(req,res,next) =>{

    const meals = await Meal.find();

    res.status(200).json({
        status:"success",
        results:meals.length,
        data:{
            meals
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