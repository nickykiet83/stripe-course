import { async } from '@angular/core/testing';
import { Request, Response } from 'express';
import { getDocData } from './database';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function stripeWebhooks(req: Request, res: Response) {

    try {

        const signature = req.headers['stripe-signature'];

        const event = stripe.webhooks.constructEvent(
            req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await onCheckoutSessionCompleted(session);

        }

        res.json({received: true});

    } catch (err) {
        console.log('Error procession webhook event, reason: ', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
}

async function onCheckoutSessionCompleted(session) {

    const purchaseSessionId = session.client_reference_id;

    const { userId, courseId } = await getDocData(`purchaseSessions/${purchaseSessionId}`);

    if (courseId) {
        fullfillCoursePurchase(userId, courseId, purchaseSessionId);
    }
}

async function fullfillCoursePurchase(userId: string, courseId: string, purchaseSessionId: string) {

}
