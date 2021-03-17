const { auth } = require('../../creds/adminSDKWeb');
const admin = require('../../creds/adminSDKWeb');
const db=admin.firestore()



exports.getUpdateClaim = async (req, res, next) => {
  const uid = '4XWGR8RglNRXzNnssvMVwDEtHJu1';
  
  
};
  
exports.postUpdateClaim = (req, res, next) => {
    const auth_token = req.authInfo;
    const gender = req.body.Gender;
    const uid = auth_token.uid;
    console.log(uid)
    admin
    .auth()
    .setCustomUserClaims(auth_token.uid, { gender: gender })
    .then(() => {
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
    if(!uid) throw "No uid";
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      const FcmToken = {};
      FcmToken[deviceId] = fcmToken;
      const updatedUserRef = await db.collection('User').doc(uid).set({FcmToken: FcmToken});
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
    res.status(404)
    res.send({
      success: false,
      error: (error.code)?error.code:error,
      status:"User Not Found"
    })
  }

}

exports.postUpdateUserLocation = async (req, res, next) => {
  const auth_token = req.authInfo;
  const geocode = req.body.geocode;
  const uid = auth_token.uid;
  
  const docId = uid + "#" + deviceId;

  try{
    if(!uid) throw "No uid";
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
