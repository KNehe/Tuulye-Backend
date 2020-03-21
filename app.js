import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mealRoutes from './src/Routes/mealRoutes';
import globalErrorHandler from './src/Controllers/errorController';
import AppError from './src/Utils/appError';
import userRoutes from "./src/Routes/userRoutes";
import cors from 'cors';
import statisticsRoutes from './src/Routes/statisticsRoutes';

dotenv.config({path:'./config.env'});

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

app.use(cors());
app.use("/api/v1/meals",mealRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/statistics",statisticsRoutes);

app.all("*",(req,res,next)=>{
    next( new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

export default app;

