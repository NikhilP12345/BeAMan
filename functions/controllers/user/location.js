const { auth } = require('../../creds/adminSDKWeb');
const admin = require('../../creds/adminSDKWeb');
const db=admin.firestore()

exports.getUsers = (req, res, next) => {
    const authToken = req.authInfo
    console.log(req.body)
}