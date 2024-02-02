const router=require('express').Router();
const exchangeController=require('../controllers/exchangeController');
const { AuthenticateToken } = require('../middleware/authenticateMiddl');


router.post('/:userId',AuthenticateToken, exchangeController.exchangeResponse);
router.get('/cc',exchangeController.hello);
router.get('/exchangeRequests/:userId',AuthenticateToken,exchangeController.showExchangeRequestswithauser);
router.post('/retourneBook/:userId',AuthenticateToken,exchangeController.returnBook)

module.exports = router;