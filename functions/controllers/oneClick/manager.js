const { app } = require('firebase-functions');
const { auth } = require('../../creds/adminSDKWeb');
const admin = require('../../creds/adminSDKWeb');
const db=admin.firestore();

const io = require('../../socket/socket');


exports.createRoom = async (req, res, next) => {
    const auth_token = req.authInfo;
    const uid = auth_token.uid;
    const roomId = Math.floor((Math.random() * 100) + 1);
    const fcmToken = req.body.fcmToken;


    try{
        if(!uid) throw "user-authentication-failed";
        const victimGeocode = "";
        const geocodes = [];
        const contact = [];
        const userRef = db.collection('User').doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists || !userDoc.data().Contact) {
            throw "Contact not present"
        } 
        else {
          const contact = userDoc.data().Contact;
        }

        const locationRef = db.collection('Location').doc(uid + '#' + fcmToken);
        const locationDoc = await locationRef.get();
        if (!locationDoc || !locationDoc.data().geocode) {
            throw "Geocode not present"
        } 
        else{
            victimGeocode = locationDoc.data().geocode;
        }
        // fetch all near by geocodes
        

        //sockets
        io.getIO().join(roomId);
        // store in db or not?
        //ask vimal
        // io.getIO().to(roomId).emit({});
        res.status(201).json({
            contact: contact,
            geocodes: geocodes,
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