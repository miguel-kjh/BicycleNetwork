let express = require('express');
let router = express.Router();
let userControllerAPI = require('../../controllers/api/userControllerAPI');

router.get('/', userControllerAPI.userList);
router.post('/create', userControllerAPI.userCreate);
router.post('/booking', userControllerAPI.userBooking);

module.exports = router;