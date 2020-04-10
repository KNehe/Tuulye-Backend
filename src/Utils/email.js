import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({path:'./config.env'});

module.exports = function(email,message){
 
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
  
    let mailOptions = {
        from: `"Tuulye Site Visitor" <${email }>`, // sender address
        to: "kamolunehemiah@gmail.com", // list of receivers
        subject: "Message", // Subject line
        text: message,// plain text body
        html: `<b>${message}</b>` // html body
    };
   

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occurs');
        }
        return console.log('Email sent!!!');
    });

};