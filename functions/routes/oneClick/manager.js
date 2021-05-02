const express = require('express');

const router = express.Router();

const authController = require('../../middlewares/authorization')
const managerController = require('../../controllers/oneClick/manager');

router.get('/createRoom', authController.auth,managerController.createRoom);

module.exports = router;

