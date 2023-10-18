const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// found all categories I have included its associated Products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: Product
      }
    })
    res.send(categories);
  } catch (err) {
    console.error('can not return products', err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// find one category by its `id` value // be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findOne({
      where: { id: categoryId },
      include: {
        model: Product
      }
    });
    res.send(category);
  } catch (err) {
    console.error('COuld not find a product with that id', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const categoryData = await req.body;

    const newCategory = await Category.create({
      category_name: categoryData.category_name
    });
    res.json(newCategory);
  } catch (err) {
    console.error('failed to add category', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { category_name } = req.body;



    const newCategory = await Category.update(
      { category_name: category_name },
      { where: { id: categoryId } }
    );
    res.json(newCategory)

  } catch (err) {
    console.error('failed to update category', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deleted = await Category.destroy({
      where: { id: categoryId }
    })
    res.json(deleted)
  } catch (err) {
    console.error('Those who can destroy a thing truly posses it.', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

module.exports = router;
