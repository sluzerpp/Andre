const uuid = require('uuid');
const path = require('path');
const { Image } = require('../models/models');
const fs = require('fs/promises');

class ImageController {
  async create({ image, productId }) {
    const filename = uuid.v4() + '.jpg';
    image.mv(path.resolve(__dirname, '..', 'static', filename));
    await Image.create({ productId, filename });
  }

  async deleteByImageId(imageId) {
    const exist = await Image.findByPk(imageId);
    if (exist) {
      const imagePath = path.resolve(__dirname, '..', 'static', exist.filename);
      try {
        await fs.rm(imagePath);
      } catch (error) {}
      await exist.destroy();
    }
    return true;
  }

  async deleteByProductId(productId) {
    const images = await Image.findAll({ where: { productId } });
    if (images.length > 0) {
      for (let image of images) {
        const imagePath = path.resolve(__dirname, '..', 'static', image.filename);
        try {
          await fs.rm(imagePath);
        } catch (error) {}
        await image.destroy();
      }
    }
    return true;
  }
}

module.exports = new ImageController();