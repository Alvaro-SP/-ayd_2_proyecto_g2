const nodemailer =require('nodemailer')
const dotenv = require("dotenv").config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
    }

    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    sendEmail(emailOptions) {
        return this.transporter.sendMail(emailOptions);
    }
}

module.exports = EmailService;