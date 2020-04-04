import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    constructor(private http: HttpClient) {

    }

    startCourseCheckoutSession(courseId: string) {
        return this.http.post('/api/checkout', {
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
}
