import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { Course } from '../model/course';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    @Output()
    courseEdited = new EventEmitter();

    isLoggedIn: boolean;

    purchaseStarted = false;

    constructor(
        private dialog: MatDialog,
        private afAuth: AngularFireAuth) {
    }

    ngOnInit() {

        this.afAuth.authState
            .pipe(
                map(user => !!user)
            )
            .subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);

    }

    purchaseCourse(course: Course, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            alert('Please login first.');
        }

        // set flag to true for process start.
        this.purchaseStarted = true;


    }

}
