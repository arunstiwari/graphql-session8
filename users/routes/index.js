const express = require('express');
const {registerUser,loginUser, fetchAllUsers, fetchUsersById} = require('../controllers');
const router = express.Router();

router.post('/users', registerUser);
router.post('/login', loginUser);
router.get('/users', fetchAllUsers);
router.get('/users/:id', fetchUsersById);

module.exports = router;