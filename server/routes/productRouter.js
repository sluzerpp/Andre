const Router = require('express');
const productController = require('../Controllers/productController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['ADMIN']), productController.create);

router.get('/', productController.getAll);

router.delete('/:id', authMiddleware(['ADMIN']), productController.delete);

module.exports = router;