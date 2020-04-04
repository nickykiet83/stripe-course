const Firestore = require('@google-cloud/firestore');

const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;

export const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFileName: serviceAccountPath
});

export async function getDocData(docPath: string) {

    const snap = await db.doc(docPath).get();

    return snap.data();

}
