import * as nodemailer from 'nodemailer'
import { __SERVER_CONFIG__ } from '../../app/app-constants';
import { Service } from "typedi";
import Logger from "../../lib/Logger";

const logger = Logger(module)

@Service()
export class EmailNotifierService {
    
    createTestAccount = async () => {    
        let testAccount = await nodemailer.createTestAccount();
        logger.info(testAccount)
    }

    // async..await is not allowed in global scope, must use a wrapper
    notify = async (to:string, html:string) => {
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: __SERVER_CONFIG__.notifier.email.host,
            port: __SERVER_CONFIG__.notifier.email.port,
            secure:__SERVER_CONFIG__.notifier.email.secure, 
            auth: {
            user: __SERVER_CONFIG__.notifier.email.user, // generated ethereal user
            pass: __SERVER_CONFIG__.notifier.email.password, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: to + ", vineeln@gmail.com, vineel@wavelabs.ai", // list of receivers
            subject: "Hello ✔", // Subject line
            html: html
        });

        logger.debug("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        logger.debug("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
}