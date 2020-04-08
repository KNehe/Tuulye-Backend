import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on("uncaughtException", err=>{
    console.log("UnCaught Exception Shutting down ...");
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path:'./config.env'});

import app from './app';




    // const DB  = process.env.DATABASE_ONLINE;

    // mongoose.connect(DB,{
    //     useNewUrlParser:true,
    //     useCreateIndex:true,
    //     useFindAndModify:false,
    //     useUnifiedTopology:true
    // })
    // .then(()=>{
    //     console.log("DB Connection successfull for prod...");
    // });




    const DB  = process.env.DATABASE_LOCAL;

    mongoose.connect(DB,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("DB Connection successfull for dev...");
    });





const port = process.env.PORT || 3000;

const server = app.listen(port,()=>{
    console.log(`Server running on port ${port}...`);
});

process.on("unhandledRejection", err=>{
    console.log("UnhandledRejection Shutting down ...", err);
    server.close(()=>{
        process.exit(1);
    });
});