const admin  = require('../creds/adminSDKWeb');
var db = admin.firestore();


const getUserProfileByUid = async(uid) => {
    try{
        const userProfile = await admin.auth().getUser(uid)
        if(!userProfile) throw "User Not present"
        else{
            return userProfile
        }
    }
    catch(err){
        return err;
    }
}

const getUserSnapShotByUid = async(uid) => {
    try{
        const userRef = db.collection('User').doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) {
          throw 'No such document!';
        } else {
          return doc.data();
        }
    }
    catch(err){
        return err;
    }
}

module.exports = {
    getUserProfileByUid,
    getUserSnapShotByUid
}