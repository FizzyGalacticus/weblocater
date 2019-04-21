// @flow

import firebase from 'firebase/app';

import config from '../../config';

const firebaseConfig = config.firebase;

firebase.initializeApp(firebaseConfig);

export { default as auth } from './auth';
export { default as firestore } from './firestore';
export default firebase;
