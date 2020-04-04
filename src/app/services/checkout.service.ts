import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheckoutSession } from '../model/checkout-session.model';
declare const Stripe;

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    constructor(private http: HttpClient) {

    }

    startCourseCheckoutSession(courseId: string): Observable<CheckoutSession> {
        return this.http.post<CheckoutSession>('/api/checkout', {
            courseId,
            callbackUrl: this.buildCallbackUrl()
        });
    }

    buildCallbackUrl() {
        const protocal = window.location.protocol,
            hostname = window.location.hostname,
            port = window.location.port;

        let callbackUrl = `${protocal}//${hostname}`;

        if (port) {
            callbackUrl += `:${port}`;
        }

        callbackUrl += '/stripe-checkout';

        return callbackUrl;
    }

    redirectToCheckout(session: CheckoutSession) {
        const stripe = Stripe(session.stripePublicKey);

        stripe.redirectToCheckout({
            sessionId: session.stripeCheckoutSessionId
        });
    }
}
