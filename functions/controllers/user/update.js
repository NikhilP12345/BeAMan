const { app } = require('firebase-functions');
const { phoneIsRegistered } = require('../../Auxillary/helper');
const { auth } = require('../../creds/adminSDKWeb');
const userUtility = require('../../utilities/userUtility');

const admin = require('../../creds/adminSDKWeb');
const db=admin.firestore()




// GET
exports.getUpdateClaim = async (req, res, next) => {

  admin
  .auth()
  .verifyIdToken(idToken)
  .then((claims) => {
    console.log(claims);
    res.status(201).json({
      success: true
    });
  })
  .catch((error) => {
    res.send({
      success: false,
      error: error,
      status:"User not exist"
    })
  });
  
};
  

exports.getContacts = async (req, res, next) => {
  const auth_token = req.authInfo;
  const uid = auth_token.uid;

  try{
    if(!uid) throw "user-authentication-failed";
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    
    let contactList = [];
    if (doc.exists) {
      const Contact = doc.data().Contact;
      if(Contact){
        for(const con in Contact){
          let temp = {};
          const uid = Contact[con].uid
          const userProfile = await userUtility.getUserProfileByUid(uid);
          const userSnapshot = await userUtility.getUserSnapShotByUid(uid);
          // console.log('Profile>>>' + userProfile);
          // console.log(userSnapshot);
          if(!userProfile.err && !userSnapshot.err){
            console.log("YEs")
            temp = {
              name: Contact[con].name,
              number: con,
              photoUrl: userProfile.photoURL,
              roomId: userSnapshot.RoomId
            }
            contactList.push(temp);
          }
        }
      }
    }
    if(contactList.length == 0){
      throw "no-contacts-added";
    }
    res.status(201).json({
      contacts: contactList,
      success: true
    });
  }
  catch(error){
    res.status(404);
    res.send({
      success: false,
      error: (error.code)?error.code:error,
      status:"User Not Found"
    })
  }
}





//POST
exports.postUpdateClaim = (req, res, next) => {
    const auth_token = req.authInfo;
    const email = auth_token.email;
    const gender = req.body.Gender;
    const uid = auth_token.uid;
    
    admin.auth().getUserByEmail(email).then(user => {
      return admin.auth().setCustomUserClaims(uid, { 
        gender: gender 
      });
    }).then(() => {
      res.status(201).json({
        success: true
      });
    })
    .catch((error) => {
      res.send({
        success: false,
        error: error,
        status:"User not exist"
      })
    });
    

};

exports.postUpdateFcmToken = async (req, res, next) => {
  const auth_token = req.authInfo;
  const fcmToken = req.body.fcmToken;
  const deviceId = req.body.deviceId;
  const uid = auth_token.uid;
  try{
    if(!uid) throw "user-authentication-failed";
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists || !doc.data().FcmToken) {
      const FcmToken = {};
      FcmToken[deviceId] = fcmToken;
      const updatedUserRef = await db.collection('User').doc(uid).set({FcmToken: FcmToken}, {merge: true});
    } 
    else {
      const FcmToken = doc.data().FcmToken;
      FcmToken[deviceId] = fcmToken;
      const updatedUserRef = await userRef.update({FcmToken: FcmToken});
    }
    res.status(201).json({
      success: true
    });
  }
  catch(error){
    res.status(404);
    res.send({
      success: false,
      error: (error.code)?error.code:error,
      status:"User Not Found"
    })
  }

}

exports.postUpdateUserLocation = async (req, res, next) => {
  const auth_token = req.authInfo;
  const uid = auth_token.uid;
  const deviceId = req.body.deviceId
  const docId = uid + "#" + deviceId;

  try{
    if(!uid) throw "user-authentication-failed";
    const updatedLocation = {
      uid: uid,
      geohash: req.body.geohash,
      deviceId: req.body.deviceId,
      lat: req.body.latitude,
      long: req.body.longitude,
      timestamp: req.body.timestamp
    };
    await db.collection('Location').doc(docId).set(updatedLocation);
    res.status(201).json({
      success: true
    });
  }
  catch(error){
    res.status(404)
    res.send({
      success: false,
      error: (error.code)?error.code:error,
      status:"User Not Found"
    })
  }

}

exports.postUpdateUserContact = async (req, res, next) => {
  const name = req.body.name;
  const number = req.body.number;
  const auth_token = req.authInfo;
  const uid = auth_token.uid;
  try{
    if(!uid) throw "user-authentication-failed";
    const phoneRef = await admin.auth().getUserByPhoneNumber(number);
    if(!phoneRef){
      throw "no-user-found"
    }
    const userRef = db.collection('User').doc(uid);
    if(phoneRef.uid === uid){
      throw "cannot-add-self-contact";
    }
    const doc = await userRef.get();
    if (!doc.exists || !doc.data().Contact) {
      const Contact = {};
      Contact[number] = {
        name : name,
        uid: phoneRef.uid
      }
      const updatedUserRef = await db.collection('User').doc(uid).set({Contact: Contact}, {merge: true});
    } 
    else {
      const Contact = doc.data().Contact;
      const len = Object.keys(Contact).length;
      if(len >= 5){
        throw "max-contact-limit"
      }
      if(number in Contact){
        throw "already-added";
      }
      Contact[number] = {
        name : name,
        uid: phoneRef.uid
      }

      const updatedUserRef = await userRef.update({Contact: Contact});
    }
    res.status(201).json({
      success: true
    });
  }
  catch(error){
    res.status(404)
    res.send({
      success: false,
      error: (error.code)?error.code:error,
      status:"User Not Found"
    })
  }
}



//DELETE

exports.deleteContact = async(req, res, next) => {
  const number = req.body.number;
  const auth_token = req.authInfo;
  const uid = auth_token.uid;

  try{
    if(!uid) throw "user-authentication-failed";
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists || !doc.data().Contact) {
        throw "contact-does-not-exist"
    } 
    else {
      const Contact = doc.data().Contact;
      if(!(number in Contact)){
        throw "contact-does-not-exist";
      }
      delete Contact[number];
      const updatedUserRef = await userRef.update({Contact: Contact});
    }
    res.status(201).json({
      success: true
    });
  }
  catch(error){
    res.status(404)
    res.send({
      success: false,
      error: (error.code)?error.code:error,
      status:"User Not Found"
    })
  }
}
