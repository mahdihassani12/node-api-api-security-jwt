const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.post('/auth/register', controller.register);
router.post('/auth/login', controller.login);

module.exports = router;