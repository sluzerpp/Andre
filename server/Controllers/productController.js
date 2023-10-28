const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs/promises');
const { Product, Tag, Image } = require('../models/models');
const productTagController = require('./productTagController');
const imageController = require('./imageController');
const { Op } = require("sequelize");
const tagController = require('./tagController');

class ProductController {
  async create(req, res, next) {
    const { data } = req.body;
    const { name, width, height, length, weight, price, tags } = JSON.parse(data);
    if (!name) {
      return next(ApiError.badRequest('Invalid name!'));
    }
    if (!length || !width || !height) {
      return next(ApiError.badRequest('Invalid product sizes!'));
    }
    if (!weight) {
      return next(ApiError.badRequest('Invalid weight!'));
    }
    if (!price || price < 0) {
      return next(ApiError.badRequest('Invalid price!'));
    }
    if (!tags && tags.length < 1) {
      return next(ApiError.badRequest('Invalid tags count!'));
    }
    let filename = '';
    let images = {};
    if (req.files && req.files.thumbnail) {
      const { thumbnail, ...otherImages } = await req.files;
      filename = uuid.v4() + '.jpg';
      thumbnail.mv(path.resolve(__dirname, '..', 'static', filename));
      images = otherImages;
    }
    

    let product = await Product.create({ name, length, width, height, weight, price, thumbnail: filename });
    for (let tag of tags) {
      await productTagController.create({ tagId: tag, productId: product.id });
    }
    const imageKeys = Object.keys(images);
    if (imageKeys.length > 0) {
      for (let key of imageKeys) {
        const image = images[key];
        await imageController.create({ image, productId: product.id });
      } 
    }
    product = await Product.findByPk(product.id, { include: [{model: Tag}, {model: Image}] });
    
    res.json(product);
  }

  async getAll(req, res, next) {
    let { page, length, width, height, weight, price, search, tags } = req.query;
    length = validateBetweenValues(length);
    width = validateBetweenValues(width);
    height = validateBetweenValues(height);
    weight = validateBetweenValues(weight);
    price = validateBetweenValues(price);
    try {
      tags = JSON.parse(tags);
    } catch (error) {
      tags = (await Tag.findAll()).map((tag) => tag.id);
      tags.push(-1);
    }
    if (!(tags instanceof Array)) {
      tags = (await Tag.findAll()).map((tag) => tag.id);
      tags.push(-1);
    }
    const limit = 15;
    if (!page) page = 1;
    const offset = limit * (page - 1);
    let products = await Product.findAll({ 
      where: {
        length: { [Op.between]: length },
        width: { [Op.between]: width },
        height: { [Op.between]: height },
        weight: { [Op.between]: weight },
        price: { [Op.between]: price },
      }, 
      include: [
        { model: Image },
        { model: Tag, where: { id: {[Op.in]: tags} } }
      ], 
      order: [['updatedAt', 'ASC']],
      offset,
      limit
    });
    if (search) {
      products = products.filter(
        (product) => product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    const productCount = await Product.count({ 
      where: {
        length: { [Op.between]: length },
        width: { [Op.between]: width },
        height: { [Op.between]: height },
        weight: { [Op.between]: weight },
        price: { [Op.between]: price },
      }
    });
    const pages = Math.ceil(productCount / limit);
    res.json({ pages, products});
  }

  async updateInfo(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const exist = await Product.findByPk(id);
    if (!exist) {
      return next(ApiError.notFound('Product not found!'));
    }
    const { name, width, height, length, weight, price, tags } = JSON.parse(data);
    if (name) {
      await exist.update({ name });
    }
    if (length && length > 0) {
      await exist.update({ length });
    }
    if (width && width > 0) {
      await exist.update({ width });
    }
    if (height && height > 0) {
      await exist.update({ height });
    }
    if (weight && weight > 0) {
      await exist.update({ weight });
    }
    if (price && price > 0) {
      await exist.update({ name });
    }
    if (tags && tags.length > 0) {
      await productTagController.deleteByProductId(exist.id);
      for (let tagId of tags) {
        await productTagController.create({ tagId, productId: exist.id });
      }
    }
    res.json(exist);
  }

  async updateImages(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const exist = await Product.findByPk(id);
    if (!exist) {
      return next(ApiError.notFound('Product not found!'));
    }
    let images = {};
    if (req.files && req.files.thumbnail) {
      const thumbnailPath = path.resolve(__dirname, '..', 'static', exist.thumbnail);
      try {
        await fs.rm(thumbnailPath);
      } catch (error) {}
      const { thumbnail, ...otherImages } = await req.files;
      filename = uuid.v4() + '.jpg';
      thumbnail.mv(path.resolve(__dirname, '..', 'static', filename));
      images = otherImages;
      await exist.update({ thumbnail: filename });
    }
    const imageKeys = Object.keys(images);
    if (imageKeys.length > 0) {
      for (let key of imageKeys) {
        const image = images[key];
        await imageController.create({ image, productId: exist.id });
      } 
    }
    res.json(exist);
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const exist = await Product.findByPk(id);
    if (!exist) {
      return next(ApiError.notFound('Product not found!'));
    }
    await imageController.deleteByProductId(exist.id);
    const thumbnailPath = path.resolve(__dirname, '..', 'static', exist.thumbnail)
    try {
      await fs.rm(thumbnailPath);
    } catch (error) {}
    await exist.destroy();
    res.json(exist);
  }
}

function validateBetweenValues(values) {
  let data = [];
  try {
    data = JSON.parse(values);
  } catch (error) {
    data = [0, Number.MAX_SAFE_INTEGER];
  }
  if (!(data instanceof Array)) data = [0, Number.MAX_SAFE_INTEGER];
  if (data.length === 1) data.push(Number.MAX_SAFE_INTEGER);
  return data;
}

module.exports = new ProductController();