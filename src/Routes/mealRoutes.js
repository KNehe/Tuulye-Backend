import express from 'express';
import mealController from '../Controllers/mealController';
import authController from './../Controllers/authenticationController';

const router = express.Router();

router
    .post('/payBill',authController.protect,mealController.payBill);
    
router
    .route("/")
    .post(mealController.createMeal)

router
     .route("/:size/:page")
     .get(authController.protect, mealController.getAllMeals);

router
    .route("/:id")
    .get(mealController.getOneMeal)
    .patch(mealController.updateMeal)
    .delete(authController.protect,authController.restrictTo("admin"),mealController.deleteMeal);


    
export default router;