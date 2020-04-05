import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckoutService } from './../services/checkout.service';

@Component({
    selector: 'stripe-checkout',
    templateUrl: './stripe-checkout.component.html',
    styleUrls: ['./stripe-checkout.component.scss']
})
export class StripeCheckoutComponent implements OnInit {

    message = "Waiting for purchase to complete...";

    waiting = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private checkoutService: CheckoutService,
        ) {

    }

    ngOnInit() {

        const result = this.route.snapshot.queryParamMap.get('purchaseResult');

        if (result === 'success') {
            const onGoingPurchaseSessionId = this.route.snapshot.queryParamMap.get('onGoingPurchaseSessionId');
            this.checkoutService.waitForPurchaseCompleted(onGoingPurchaseSessionId)
                .subscribe(
                    () => {
                        this.waiting = false;
                        this.message = 'Purchase SUCESSFUL, redirecting...';
                        setTimeout(() => this.router.navigateByUrl('/courses'), 3000);
                    },
                );
        } else {
            this.waiting = false;
            this.message = 'Purchase CANCELED OR FAILED, redirecting...';
            setTimeout(() => this.router.navigateByUrl('/courses'), 3000);
        }

    }

}
