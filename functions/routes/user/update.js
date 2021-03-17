const express = require('express');
const { auth } = require('firebase-admin');

const updateClaimController = require('../../controllers/user/update');
const authController = require('../../middlewares/authorization')

const router = express.Router();

// GET /user
router.get('/updateClaim', updateClaimController.getUpdateClaim);

// POST /user
router.post('/updateClaim', authController.auth, updateClaimController.postUpdateClaim);
router.post('/updateFcmToken', authController.auth, updateClaimController.postUpdateFcmToken);
router.post('/updateUserLocation', authController.auth, updateClaimController.postUpdateUserLocation);

module.exports = router;