import cron from 'node-cron';
import { sendEmail } from './nodemailer';
const schedule = require('node-schedule');

export const emailScheduler = async () => {

    // TODO: Create a cron job that sends an email everyday at 9:00 AM based on the expiry date of the protection plan
    // What if mileage expires first? email will still be sent on the expiry date
    // suggestion - send an email to the contact person of the dealership and let them check if the protection plan has expired. 

    // Schedule a cron job to run every 5 minutes
    // const cronJob = cron.schedule('*/5 * * * *', async () => {
    // cron.schedule('*/5 * * * *', async () => {
    //     console.log('inside cron job');
    //     try {
    //         await sendEmail({
    //         to: 'mark_a_capili@outlook.com',
    //         subject: 'Protection Plan Expiry Reminder',
    //         text: 'Test email'
    //         });
    //     } catch (error: any) {
    //         console.log(error.message)
    //     }
    // }, { timezone: 'Asia/Manila' });

    // Start the cron job
    // cronJob.start();


    // schedule.scheduleJob('*/3 * * * *', async () => {
    // Make sure that date is in UTC - 8 hours Phlippines time
    schedule.scheduleJob('2025-01-16T11:00:00.000', async () => {
        try {
            await sendEmail({
            to: 'mark_a_capili@outlook.com',
            subject: 'Protection Plan Expiry Reminder',
            text: 'Test Email Actual Date UTC Time'
            });
        } catch (error: any) {
            console.log(error.message)
        }
    })


}

export default emailScheduler
