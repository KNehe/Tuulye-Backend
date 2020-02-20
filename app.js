import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mealRoutes from './Routes/mealRoutes';
import globalErrorHandler from './Controllers/errorController';
import AppError from './Utils/appError';
import userRoutes from "./Routes/userRoutes";

dotenv.config({path:'./config.env'});

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

app.use("/api/v1/meals",mealRoutes);
app.use("/api/v1/users",userRoutes);

app.all("*",(req,res,next)=>{
    next( new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

export default app;

