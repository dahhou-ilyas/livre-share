const router=require('express').Router();
const exchangeController=require('../controllers/exchangeController');


router.post('/:userId', exchangeController.exchangeResponse);
router.get('/cc',exchangeController.hello)

module.exports = router;