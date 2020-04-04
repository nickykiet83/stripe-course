import {Request, Response} from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

interface RequestInfo {
    courseId: string;
}

export async function createCheckoutSession(req: Request, res: Response) {
    try {

        const info: RequestInfo = {
            courseId: req.body.courseId
        };

        console.log('Purchasing course with id: ', info.courseId);



        res.status(200).send();



    } catch (error) {
        console.log('Unexpected error occured while purchasing course: ', error);
        res.status(500).json({error: 'Could not initiate Stripec checkout session'});
    }
}
