const router=require('express').Router();
const userController=require('../controllers/userController')
const bookController=require('../controllers/bookController');
const { AuthenticateToken } = require('../middleware/authenticateMiddl');


router.post('/login',userController.login)
router.post('/', userController.addUsers);
router.put('/:id',AuthenticateToken, userController.updateUsers);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

router.delete('/:id', userController.deleteUser);

router.post('/:userId/books',AuthenticateToken,bookController.addBook);
router.delete('/:userId/books/:bookId',AuthenticateToken,bookController.deletebook);

router.post('/:userId/exchangeRequests',AuthenticateToken,userController.sendExchangeRequest);



module.exports = router;