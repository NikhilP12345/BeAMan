const { app } = require('firebase-functions');
const { auth } = require('../../creds/adminSDKWeb');
const admin = require('../../creds/adminSDKWeb');
const db=admin.firestore()


// GET
// exports.getUpdateClaim = async (req, res, next) => {

//   admin
//   .auth()
//   .verifyIdToken(idToken)
//   .then((claims) => {
//     console.log(claims);
//     res.status(201).json({
//       success: true
//     });
//   })
//   .catch((error) => {
//     res.send({
//       success: false,
//       error: error,
//       status:"User not exist"
//     })
//   });
  
// };
  

exports.getContacts = async (req, res, next) => {
  const auth_token = req.authInfo;
  const uid = auth_token.uid;

  try{
    if(!uid) throw "user-authentication-failed";
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    
    let contactsList = [];
    if (doc.exists) {
      const Contact = doc.data().Contact;
      if(Contact){
        for(const prop in Contact){
          let temp = {
            name: Contact[prop],
            number: prop
          }
          contactsList.push(temp);
        }
      }
    }
    res.status(201).json({
      contacts: contactsList,
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
      geocode: req.body.geocode,
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
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists || !doc.data().Contact) {
      const Contact = {};
      Contact[number] = name
      const updatedUserRef = await db.collection('User').doc(uid).set({Contact: Contact}, {merge: true});
    } 
    else {
      const Contact = doc.data().Contact;
      const len = Object.keys(Contact).length;
      if(len >= 5){
        throw "limit-exceeded"
      }
      if(number in Contact){
        throw "contact-already-exists";
      }
      Contact[number] = name;
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
        throw "contact-doesnt-exists"
    } 
    else {
      const Contact = doc.data().Contact;
      if(!(number in Contact)){
        throw "contact-doesnt-exists";
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
