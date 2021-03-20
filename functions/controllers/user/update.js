const { auth } = require('../../creds/adminSDKWeb');
const admin = require('../../creds/adminSDKWeb');
const db=admin.firestore()

const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRlMDBlOGZlNWYyYzg4Y2YwYzcwNDRmMzA3ZjdlNzM5Nzg4ZTRmMWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoibmlraGlsIiwiZ2VuZGVyIjoiTWFsZSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9iZS1hLW1hbi1kZXYiLCJhdWQiOiJiZS1hLW1hbi1kZXYiLCJhdXRoX3RpbWUiOjE2MTU4MDc4NTYsInVzZXJfaWQiOiJxdFRVY091SXNnWFVzd1k2VjlpNFVkOEdKcUMzIiwic3ViIjoicXRUVWNPdUlzZ1hVc3dZNlY5aTRVZDhHSnFDMyIsImlhdCI6MTYxNjA2NTc0MCwiZXhwIjoxNjE2MDY5MzQwLCJlbWFpbCI6InBhcmloYXJuaWtoaWw5MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6Iis5MTk2NjA2NzcxODAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis5MTk2NjA2NzcxODAiXSwiZW1haWwiOlsicGFyaWhhcm5pa2hpbDkyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.B5tG9hr5ra7_6un9p0dKp3J54yM6_BPsEfoE0pZUiV6w5Y7PGGIci7UUuw2g5s-OAoCssPxkp8UBAtDnfJYDevdI4FkWlHMXs28M_8WRKLj2uZsXgsgyQcDHl891chGKgJiqt82c1J0QoxbE8TCcdG-KK7LtND0QQ2M0ullw3LxQUun2sneDXHWaOwvzYgqCLcLb0rip_xY5CFvZlk4KH_x3GutfeRy2YNv9upF-iBOlnrMnZbVEytnQxH4W9-rNXj8CI03gq_X5zTxN0dUKi3MneVvFRhcPC47b8iv8Rf-F_ggx2Fpm0oviBN7H6jna_LJ6u0akkH0V-mBtBTFF6w"

exports.getUpdateClaim = async (req, res, next) => {
  // const uid = '4XWGR8RglNRXzNnssvMVwDEtHJu1';
  // console.log(idToken)
  // const auth_token = req.authInfo;
  // console.log(auth_token)
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
  const uid = auth_token.uid;
  const deviceId = req.body.deviceId
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
