import Meal from '../Models/mealModel';
import CatchAsync from '../Utils/catchAsync';
import AppError from '../Utils/appError';

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


export default {createMeal,getAllMeals,deleteMeal,updateMeal,getOneMeal};