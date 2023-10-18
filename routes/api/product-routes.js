const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
// find all products be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, Tag]
    })
    res.send(products)
  } catch (err) {
    console.error('Could not retrieve products', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// get one product // be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({
      where: { id: productId },
      include: [Category, Tag]
    })
    res.send(product)
  } catch (err) {
    console.error('Could not retrieve product with that id', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, category_id, tagIds } = req.body;

    const newProduct = await Product.create({
      product_name,
      price,
      stock,
      category_id,
    });
    if (tagIds && tagIds.length) {
      const productTagIds = tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIds);
    }
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Failed to create product', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { product_name, price, stock, category_id, tagIds } = req.body;

    await Product.update(
      { product_name, price, stock, category_id },
      { where: { id: productId } }
    );

    if (tagIds && tagIds.length) {
      const currentProductTags = await ProductTag.findAll({
        where: { product_id: productId },
      });
      const currentTagIds = currentProductTags.map(({ tag_id }) => tag_id);
      const newTagIds = tagIds.filter((tag_id) => !currentTagIds.includes(tag_id));
      const removedTags = currentTagIds.filter((tag_id) => !tagIds.includes(tag_id));

      await ProductTag.destroy({
        where: { id: removedTags },
      });
      const newProductTags = newTagIds.map((tag_id) => ({
        product_id: productId,
        tag_id,
      }));
      await ProductTag.bulkCreate(newProductTags)
    }
    const updatedProduct = await Product.findByPk(productId);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Failed to update product', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})



// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.destroy({
      where: { id: productId }
    })
    res.json(deletedProduct)
  } catch (err) {
    console.error('those who can destroy a thing truly possess it', err)
    res.status(500).json({error: 'those who can destroy a thing truly possess it.'})
  }
})

module.exports = router;
