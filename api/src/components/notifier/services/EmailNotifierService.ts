import * as nodemailer from 'nodemailer';
import { NotifierConfigOptions } from "../config/NotifierConfigOptions";
import { Inject, Service } from "typedi";
import Logger from "../../../lib/core/logger/Logger";

const logger = Logger(module)

@Service()
export class EmailNotifierService {

    @Inject('NotifierConfigOptions')
    private readonly notifierConfig: NotifierConfigOptions

    createTestAccount = async () => {
        let testAccount = await nodemailer.createTestAccount();
        logger.info(testAccount)
    }

    // async..await is not allowed in global scope, must use a wrapper
    notify = async (to: string, html: string) => {

        logger.info("notifier config:", this.notifierConfig);

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: this.notifierConfig.email.host,
            port: this.notifierConfig.email.port,
            secure: this.notifierConfig.email.secure,
            auth: {
                user: this.notifierConfig.email.user, // generated ethereal user
                pass: this.notifierConfig.email.password, // generated ethereal password
            },
        });

        try {
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
        } catch (e) {
            /**
             * for dev purposes.
             */            
            let testAccount = await nodemailer.createTestAccount();
            this.notifierConfig.email.user = testAccount.user;
            this.notifierConfig.email.password = testAccount.pass;
            throw e;
        }

    }
}