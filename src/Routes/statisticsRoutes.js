import express from 'express';
import statisticsController from './../Controllers/statisticsController';
import authController from './../Controllers/authenticationController';


const router = express.Router();

router.get('/',authController.protect,authController.restrictTo("admin"),statisticsController.getStatistics);


export default router;