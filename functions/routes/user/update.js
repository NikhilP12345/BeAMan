const express = require('express');
const { auth } = require('firebase-admin');

const updateController = require('../../controllers/user/update');
const locationController = require('../../controllers/user/location')
const authController = require('../../middlewares/authorization')

const router = express.Router();

// GET /user
router.get('/updateClaim', authController.auth,updateController.getUpdateClaim);
router.get('/getUsers', authController.auth,locationController.getUsers);
router.get('/getAllContacts', authController.auth, updateController.getContacts);


// POST /user
router.post('/updateClaim', authController.auth, updateController.postUpdateClaim);
router.post('/updateFcmToken', authController.auth, updateController.postUpdateFcmToken);
router.post('/updateUserLocation', authController.auth, updateController.postUpdateUserLocation);
router.post('/addContact', authController.auth, updateController.postUpdateUserContact);

//DELETE
router.delete('/deleteContact', authController.auth, updateController.deleteContact);


module.exports = router;