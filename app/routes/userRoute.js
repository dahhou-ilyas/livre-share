const router=require('express').Router();
const userController=require('../controllers/userController')
const bookController=require('../controllers/bookController')

router.post('/login',userController.login)

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.addUsers);
router.put('/:id', userController.updateUsers);
router.delete('/:id', userController.deleteUser);

router.post('/:userId/books',bookController.addBook);
router.delete('/:userId/books/:bookId',bookController.deletebook);

router.post('/:userId/exchangeRequests', userController.sendExchangeRequest);



module.exports = router;