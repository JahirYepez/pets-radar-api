import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { envs } from 'src/config/envs';
import { EmailOptions } from 'src/core/interfaces/email-options.interface';

@Injectable()
export class EmailService {
    private readonly isConfigured = Boolean(
        envs.MAILER_SERVICE && envs.MAILER_EMAIL && envs.MAILER_PASSWORD
    );

    private transporter = nodemailer.createTransport({
        service:envs.MAILER_SERVICE,
        auth:{
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_PASSWORD
        }
    });

    async sendEmail(options:EmailOptions) : Promise<Boolean> {
        try{
            if (!this.isConfigured) {
                console.warn("[EmailService] Mailer is not configured. Email was not sent.");
                return false;
            }

            await this.transporter.sendMail({
                to: options.to,
                subject: options.subject,
                html: options.html
            });
            return true;
        }catch(error){
            console.error(error);
            return false;
        }
    }
}
