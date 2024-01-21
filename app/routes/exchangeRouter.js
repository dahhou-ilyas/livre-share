const router=require('express').Router();
const exchangeController=require('../controllers/exchangeController');


router.get('/:userId', exchangeController.exchangeResponse);

module.exports = router;