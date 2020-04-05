import * as firebase from 'firebase';

import { COURSES, findLessonsForCourse } from './db-data';


const config = {
    // TODO copy-paste here your own config, taken from the Firebase dashboard
    apiKey: 'AIzaSyDwpPWvMhNTLDrOzSwTrLgp9ynifpo1Cy0',
    authDomain: 'stripe-course-7a044.firebaseapp.com',
    databaseURL: 'https://stripe-course-7a044.firebaseio.com',
    projectId: 'stripe-course-7a044',
    storageBucket: 'stripe-course-7a044.appspot.com',
    messagingSenderId: '327790143856',
    appId: '1:327790143856:web:1b09f161771a7b21ed47b5'
};

console.log('Uploading data to the database with the following config:\n');

console.log(JSON.stringify(config));

console.log('\n\n\n\nMake sure that this is your own database, so that you have write access to it.\n\n\n');

firebase.initializeApp(config);

const db = firebase.firestore();

async function uploadData() {

    const batch = db.batch();

    const courses = db.collection('courses');


    Object.values(COURSES)
        .sort((c1: any, c2: any) => c1.seqNo - c2.seqNo)
        .forEach(async (course: any) => {

            const newCourse = removeId(course);

            const courseRef = await courses.add(newCourse);

            const lessons = courseRef.collection('lessons');

            const courseLessons = findLessonsForCourse(course.id);

            // console.log(`Adding ${courseLessons.length} lessons to ${course.description}`);

            courseLessons.forEach(async lesson => {

                const newLesson = removeId(lesson);

                await lessons.add(newLesson);

            });

        });

    return batch.commit();
}


function removeId(data: any) {

    const newData: any = { ...data };

    delete newData.id;

    return newData;
}


uploadData()
    .then(() => {
        console.log('Writing data, exiting in 10 seconds ...\n\n');

        setTimeout(() => {

            console.log('\n\n\nData Upload Completed.\n\n\n');
            process.exit(0);

        }, 10000);

    })
    .catch(err => {
        console.log('Data upload failed, reason:', err, '\n\n\n');
        process.exit(-1);
    });


