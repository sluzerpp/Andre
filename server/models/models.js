const sequelize = require('../db');
const {DataTypes} = require('sequelize')

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  width: { type: DataTypes.DECIMAL(1), allowNull: false },
  height: { type: DataTypes.DECIMAL(1), allowNull: false },
  length: { type: DataTypes.DECIMAL(1), allowNull: false },
  weight: { type: DataTypes.DECIMAL(1), allowNull: false },
  price: { type: DataTypes.DECIMAL(2), allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  thumbnail: { type: DataTypes.STRING, allowNull: false }, 
});

const Tag = sequelize.define('tag', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const ProductTag = sequelize.define('producttag', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

const Image = sequelize.define('image', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  filename: { type: DataTypes.STRING, allowNull: false },
});

const Promocodes = sequelize.define('promocode', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  discount: { type: DataTypes.INTEGER, allowNull: false },
});

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  address: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  fullPrice: { type: DataTypes.DECIMAL(2), allowNull: false },
});

const OrderProduct = sequelize.define('orderproduct', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

Product.belongsToMany(Tag, { through: ProductTag, onDelete: 'CASCADE' });
Tag.belongsToMany(Product, { through: ProductTag, onDelete: 'CASCADE' });

Product.hasMany(Image);
Image.belongsTo(Product);

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

module.exports = {
  Product,
  Tag,
  Image,
  Order,
  Promocodes,
  OrderProduct,
  ProductTag,
}