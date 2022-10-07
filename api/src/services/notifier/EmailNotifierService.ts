import * as nodemailer from 'nodemailer'
import { __CONFIG__ } from '../../app/app-constants';

export class EmailNotifierService {
    
    createTestAccount = async () => {    
        let testAccount = await nodemailer.createTestAccount();
        console.log(testAccount)
    }

    // async..await is not allowed in global scope, must use a wrapper
    notify = async (to:string, html:string) => {
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: __CONFIG__.email.auth.host,
            port: __CONFIG__.email.auth.port,
            secure:__CONFIG__.email.auth.secure, 
            auth: {
            user: __CONFIG__.email.auth.user, // generated ethereal user
            pass: __CONFIG__.email.auth.password, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: to + ", vineeln@gmail.com, vineel@wavelabs.ai", // list of receivers
            subject: "Hello ✔", // Subject line
            html: html
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
}