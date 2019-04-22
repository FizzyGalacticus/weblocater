// @flow

import firebase from 'firebase/app';
import 'firebase/firestore';

let db: firebase.firestore.Firestore;

const createDb = () => {
    db = firebase.firestore();
};

const createDbIfNotInitialized = fn => {
    return (...params) => {
        if (!db) createDb();

        return fn(...params);
    };
};

export const set = createDbIfNotInitialized((key, id, data) => {
    const sanitizedData: object = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }

        return acc;
    }, {});

    return db
        .collection(key)
        .doc(id)
        .set(sanitizedData);
});

export const create = createDbIfNotInitialized(
    (key: string, data: any): Promise => {
        return db.collection(key).add(data);
    }
);

export const readDocument = createDbIfNotInitialized((key, docKey) => {
    return db
        .collection(key)
        .doc(docKey)
        .get();
});

export const updateDocument = createDbIfNotInitialized((key, docKey, value) => {
    return db
        .collection(key)
        .doc(docKey)
        .set(value);
});

export const getDocsFromResponse = response =>
    response.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
    }, {});

export const readCollection = createDbIfNotInitialized(async (key: string, whereClause: Array<string>) => {
    let response;

    if (whereClause !== undefined) {
        response = await db
            .collection(key)
            .where(...whereClause)
            .get();
    }

    response = await db.collection(key).get();

    return getDocsFromResponse(response);
});

export default { set, create, readCollection, readDocument, updateDocument, getDocsFromResponse };
