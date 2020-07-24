const express = require('express');
const router = express.Router();

const Users= require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

// routes dealing with user collection

router.post('/register',Users.register);
router.delete('/delete',Users.deleteuser);
router.post('/login', Users.login);
router.post('/createConnection' , checkAuth, Users.createConnection);
router.post('/removeConnection' , checkAuth, Users.removeConnection);
router.get('/showConnection', checkAuth , Users.showConnection);

module.exports = router;
