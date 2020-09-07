var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/bicycleControllerAPI');

router.get('/', controller.bicycleList);

router.post('/create', controller.bicycleCreate);

router.delete('/delete', controller.bicycleDelete);


module.exports = router;