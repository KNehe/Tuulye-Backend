"use strict";
const nodemailer = require("nodemailer");
import dotenv from 'dotenv';
import catchAsync from './catchAsync';
dotenv.config({path:'./config.env'});


// async..await is not allowed in global scope, must use a wrapper
const sendEMail = catchAsync(async (senderEmail,senderMessage) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Tuulye Site Visitor" <${senderEmail}>`, // sender address
    to: "kamolunehemiah@gmail.com", // list of receivers
    subject: "Message", // Subject line
    text: senderMessage,// plain text body
    html: `<b>${senderMessage}</b>` // html body
  });

  transporter.sendMail(info)
    .then(function(response){
      console.log('Email sent')
    })
    .catch( function(error){
      console.log('Email error',error);
      return error;
    })

});



export default sendEMail;
