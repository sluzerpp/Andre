const Router = require('express');
const AdminController = require('../Controllers/adminController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', AdminController.login);

router.get('/auth', authMiddleware(['ADMIN']), AdminController.check);

module.exports = router;