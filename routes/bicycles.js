var express = require('express')
var router = express.Router();
var controller = require('../controllers/bicycle-controllers')

router.get('/', controller.bicycleList);

router.get('/create', controller.bicycleCreateGet);

router.post('/create', controller.bicycleCreatePost);

router.post('/:id/delete', controller.bicycleDeletePost);

router.get('/:code/update', controller.bicycleUpdateGet);
router.post('/:code/update', controller.bicycleUpdatePost);





module.exports = router;