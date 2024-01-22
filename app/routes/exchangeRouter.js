const router=require('express').Router();
const exchangeController=require('../controllers/exchangeController');


router.post('/:userId', exchangeController.exchangeResponse);
router.get('/cc',exchangeController.hello);
router.get('/exchangeRequests/:userId',exchangeController.showExchangeRequestswithauser);
router.post('/retourneBook/:userId',exchangeController.returnBook)

module.exports = router;