require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const fileUpload = require('express-fileupload');
const path = require('path');
const models = require('./models/models');
const ErrorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware');
const router = require('./routes/index');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.options('*', cors({
  origin: '*'
}))
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));

app.use('/api', router);

app.use(ErrorHandlingMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}


start();