import { Course } from './../src/app/model/course';
import {Request, Response} from 'express';
import { getDocData } from './database';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

interface RequestInfo {
    courseId: string;
    callbackUrl: string;
}

export async function createCheckoutSession(req: Request, res: Response) {
    try {

        const info: RequestInfo = {
            courseId: req.body.courseId,
            callbackUrl: req.body.callbackUrl,
        };

        console.log('Purchasing course with id: ', info.courseId);

        let sessionConfig;

        if (info.courseId) {
            const course: Course = await getDocData(`/courses/${info.courseId}`);
            sessionConfig = setupPurchaseCourseSession(info, course);
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        console.log(session);

        res.status(200).json({
            stripeCheckoutSessionId: session.id,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY
        });



    } catch (error) {
        console.log('Unexpected error occured while purchasing course: ', error);
        res.status(500).json({error: 'Could not initiate Stripec checkout session'});
    }
}

function setupPurchaseCourseSession(info: RequestInfo, course: Course) {
    const config = setupBaseSessionConfig(info);

    config.line_items = [
        {
          name: course.titles.description,
          description: course.titles.longDescription,
          amount: course.price * 100,
          currency: 'usd',
          quantity: 1,
        },
      ];

    return config;
}

function setupBaseSessionConfig(info: RequestInfo) {
    const config: any = {
        payment_method_types: ['card'],
        success_url: `${info.callbackUrl}/?purchaseResult=success`,
        cancel_url: `${info.callbackUrl}/?purchaseResult=failed`,
    };

    return config;
}
