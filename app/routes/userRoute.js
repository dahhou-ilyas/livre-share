const router=require('express').Router();
const userController=require('../controllers/userController')

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.addUsers);
// router.put('/:id', userController.updateUsers);
// router.delete('/:id', userController.deleteUser);


module.exports = router;