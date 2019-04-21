// @flow

import firebase from 'firebase/app';
import 'firebase/auth';

import firestore from './firestore';

export const getAuth = (): FirebaseAuth | null => {
    const auth = localStorage.getItem('auth');

    return JSON.parse(auth);
};

export const login = async (storageOnly: boolean = false): FirebaseAuth => {
    let auth = getAuth();

    if (auth !== null) {
        return auth;
    } else if (!storageOnly) {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().useDeviceLanguage();

            auth = await firebase.auth().signInWithPopup(provider);

            localStorage.setItem('auth', JSON.stringify(auth));
        } catch (err) {
            // Do Nothing
        }
    }

    return auth;
};

export const logout = async () => {
    const auth = getAuth();

    if (auth) {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('auth');
        } catch (err) {
            return false;
        }
    }

    return true;
};

export const getUser = async () => {
    const auth = getAuth();
    let user = null;

    if (auth) {
        const doc = await firestore.readDocument('users', auth.user.uid);

        if (doc.exists) {
            user = {
                ...doc.data(),
                uid: auth.user.uid
            };
        } else {
            const {
                additionalUserInfo: {
                    profile: { name, gender, picture, email, link }
                }
            } = auth;

            await firestore.set('users', auth.user.uid, { name, gender, picture, email, link });

            user = {
                name,
                gender,
                picture,
                email,
                link,
                uid: auth.user.uid
            };
        }
    }

    return user;
};

export default { login, logout, getAuth, getUser };
