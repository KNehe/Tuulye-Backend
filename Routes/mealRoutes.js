import express from 'express';
import mealController from '../Controllers/mealController';

const router = express.Router();

router
    .route("/")
    .get(mealController.getAllMeals)
    .post(mealController.createMeal);

router
    .route("/:id")
    .get(mealController.getOneMeal)
    .patch(mealController.updateMeal)
    .delete(mealController.deleteMeal);
    
export default router;