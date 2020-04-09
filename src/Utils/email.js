"use strict";
const nodemailer = require("nodemailer");
import dotenv from 'dotenv';
dotenv.config({path:'./config.env'});


// async..await is not allowed in global scope, must use a wrapper
async function sendEMail(senderEmail,senderMessage) {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

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

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendEMail().catch(console.error);

export default sendEMail;
