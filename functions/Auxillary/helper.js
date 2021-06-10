const { app } = require('firebase-functions');
const { user } = require('firebase-functions/lib/providers/auth');
const { auth } = require('../creds/adminSDKWeb');
const admin = require('../creds/adminSDKWeb');
const db=admin.firestore();


const phoneIsRegistered = (mobile) => {
    return admin
    .auth()
    .getUserByPhoneNumber(mobile)
    .then((userRecord) => {
        return {exist: true}
    })
    .catch((error) => {
        return {exist: false}
    });
    
}

module.exports = {
    phoneIsRegistered
}