import Meal from './../Models/mealModel';
import Purchase from './../Models/purchaseModel';
import CatchAsync from '../Utils/catchAsync';

const getStatistics = CatchAsync(async  (req,res,next) => {

    const meals =await  Meal.find();
    const purchases = await Purchase.find();

    res.status(200).json({
        status:'success',
        data:{
            no_of_meals: meals.length,
            no_of_purchases: purchases.length
        }
    })

});
export default {getStatistics};