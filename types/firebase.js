// @flow

declare type FirebaseAuth = {
    additionalUserInfo: {
        providerId: string,
        isNewUser: boolean,
        profile: {
            email: string,
            family_name: string,
            gender: string,
            given_name: string,
            id: string,
            link: string,
            locale: string,
            name: string,
            picture: string,
            verified_email: boolean
        }
    },
    credential: {
        a: any,
        accessToken: string,
        idToken: string,
        providerId: string,
        signInMethod: string
    },
    operationType: string,
    user: {
        apiKey: string,
        appName: string,
        authDomain: string,
        createdAt: string,
        displayName: string,
        email: string,
        emailVerified: boolean,
        isAnonymous: boolean,
        lastLoginAt: string,
        phoneNumber: any,
        photoURL: string,
        providerData: [
            { uid: string, displayName: string, email: string, phoneNumber: any, photoURL: string, providerId: string }
        ],
        redirectEventId: any,
        stsTokenManager: {
            accessToken: string,
            apiKey: string,
            expirationTime: number,
            refreshToken: string
        },
        uid: string
    }
} | null;

declare type FirebaseId = string;
