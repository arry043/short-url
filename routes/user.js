const express = require('express');
const router = express.Router();
const {Signup, Login} = require('../controllers/user');

router.post('/', Signup);
router.post('/login', Login);

module.exports = router;