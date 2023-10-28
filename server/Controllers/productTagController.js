const { ProductTag } = require('../models/models');

class ProductTagController {
  async create({ tagId, productId }) {
    await ProductTag.create({ tagId, productId });
  }

  async deleteByProductId(productId) {
    await ProductTag.destroy({ where: { productId } });
  }
}

module.exports = new ProductTagController();