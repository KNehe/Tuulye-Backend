import express from 'express';
import searchController from '../Controllers/searchController';

const router = express.Router();


router.post('/',searchController.searchMeal);

export default router;
