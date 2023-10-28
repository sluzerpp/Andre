const Router = require('express');
const TagController = require('../Controllers/tagController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['ADMIN']), TagController.create);

router.delete('/:id', authMiddleware(['ADMIN']), TagController.delete);

router.get('/', TagController.getAll)

module.exports = router;