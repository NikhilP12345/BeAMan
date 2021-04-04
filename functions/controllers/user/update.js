const { app } = require('firebase-functions');
const { auth } = require('../../creds/adminSDKWeb');
const admin = require('../../creds/adminSDKWeb');
const db=admin.firestore()

const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRlMDBlOGZlNWYyYzg4Y2YwYzcwNDRmMzA3ZjdlNzM5Nzg4ZTRmMWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVmltYWwgS3VtYXdhdCIsInBpY3R1cmUiOiJodHRwczovL2ZpcmViYXNlc3RvcmFnZS5nb29nbGVhcGlzLmNvbS92MC9iL2JlLWEtbWFuLWRldi5hcHBzcG90LmNvbS9vL3VzZXJzJTJGNFhXR1I4UmdsTlJYek5uc3N2TVZ3REV0SEp1MSUyRnByb2ZpbGVfaW1hZ2UuanBnP2FsdD1tZWRpYSZ0b2tlbj1mMWM4MGI3NC1mZTI5LTRiZTEtYWUyOS1mNjE1NjkxN2I2NDAiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmUtYS1tYW4tZGV2IiwiYXVkIjoiYmUtYS1tYW4tZGV2IiwiYXV0aF90aW1lIjoxNjE2NDA3NTE3LCJ1c2VyX2lkIjoiNFhXR1I4UmdsTlJYek5uc3N2TVZ3REV0SEp1MSIsInN1YiI6IjRYV0dSOFJnbE5SWHpObnNzdk1Wd0RFdEhKdTEiLCJpYXQiOjE2MTY0MDc1NDcsImV4cCI6MTYxNjQxMTE0NywiZW1haWwiOiJkZXYuZXJrdW1hd2F0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicGhvbmVfbnVtYmVyIjoiKzkxODgyNDA1Mzk3NCIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzkxODgyNDA1Mzk3NCJdLCJlbWFpbCI6WyJkZXYuZXJrdW1hd2F0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.Ol_xxdwnZjz9LWwxqqsiJnbZEEnYVWg_7ml6C19P4CRZkaEf1nepTd2yo2Q2mOC_wA4mmgCIc0efVyam0ckqg5wnOWKClu6OzAX_zAs0zSjYL8Ip68KfxAFd3Q7Zjp6yihY_brwfm2c17FcrmWxX1omBchNQ4Ip5sphyKTfRqqHunhGwpWnXwbiGCvQavNUfRA9RQj24b3Hw9lWHZXp_laNNd82C-mmtJGZs-NyP-P0lUMBNJYHLMm07LZoFFe5KOw6pw0rK8rUBgu2pQ-S02N8eNHqkdRhJ_IH4obG45kQNAvcC-ES2oG5hrVwP1r9Xog-I_Jt8bNOwJUQWKZbvkQ"



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
    if(!uid) throw "No uid";
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      throw "No Contact Found";
    } 
    const Contact = doc.data().Contact;
    if(!Contact){
      throw "No Contact Found";
    }
    let arrayContact = [];
    for(const prop in Contact){
      let temp = {
        name: Contact[prop],
        number: prop
      }
      arrayContact.push(temp);
    }
    res.status(201).json({
      Contacts: arrayContact,
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
    if(!uid) throw "No uid";
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

exports.postUpdateUserContact = async (req, res, next) => {
  const name = req.body.name;
  const number = req.body.number;
  const auth_token = req.authInfo;
  const uid = auth_token.uid;
  try{
    if(!uid) throw "No uid";
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
        throw "Contacts greater than 5"
      }
      if(number in Contact){
        throw "Number Already Present";
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
    if(!uid) throw "No uid";
    const userRef = db.collection('User').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists || !doc.data().Contact) {
        throw "Contact not exist"
    } 
    else {
      const Contact = doc.data().Contact;
      if(!(number in Contact)){
        throw "Contact not exist";
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
