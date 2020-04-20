import Meal from '../Models/mealModel';
import CatchAsync from '../Utils/catchAsync'; 

const searchMeal = CatchAsync(async (req,res,next)=>{
    
    const result = await Meal.find({name: { $regex: req.body.name , $options:'i'} });
    
    if(result.length == 0){

        return   res.status(200)
            .json({ 
                 status:'success', 
                 data:{
                     result:'No results found'
                    }
                    });
    }
    
    res.status(200)
        .json({
             status:'success', 
             data:{
                    result
                  }
        });

});

export default {searchMeal};