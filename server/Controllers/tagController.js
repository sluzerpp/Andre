const ApiError = require('../error/ApiError');
const { Tag, ProductTag } = require('../models/models');

class TagController {
  async create(req, res, next) {
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest('Invalid tag name!'));
    }
    const tag = await Tag.create({ name });
    res.json(tag);
  }

  async getAll(req, res, next) {
    const tags = await Tag.findAll();
    const tagsWithProductCount = [];
    for (let tag of tags) {
      const count = await tag.countProducts();
      tagsWithProductCount.push({
        ...(await tag.toJSON()),
        productCount: count
      });
    }
    res.json(tagsWithProductCount);
  }

  async update(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest('Invalid name!'));
    }
    const exist = await Tag.findByPk(id);
    if (!exist) {
      return next(ApiError.notFound('Tag not found!'));
    }
    await exist.update({ name });
    res.json(exist);
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const exist = await Tag.findByPk(id);
    if (!exist) {
      return next(ApiError.notFound('Tag not found!'));
    }
    await ProductTag.destroy({ where: { tagId: exist.id } });
    await exist.destroy();
    res.json(exist);
  }
}

module.exports = new TagController();