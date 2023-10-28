const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const userRouter = require('./userRouter');
const tagRouter = require('./tagRouter');
const productRouter = require('./productRouter');

router.use('/admin', userRouter);
router.use('/tag', tagRouter);
router.use('/product', productRouter);

module.exports = router;