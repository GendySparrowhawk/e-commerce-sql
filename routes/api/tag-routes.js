const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');


// The `/api/tags` endpoint

// find all tags// be sure to include its associated Product data
router.get('/', async (req, res) => {
try {
  const tags = await Tag.findAll({
    include: [Product]
  });
  res.send(tags);
} catch (err) {
  console.error('Could not retrieve tags', err)
  res.status(500).json({ error: 'Internal Server Error' })
}
});

// find a single tag by its `id` // be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id

  const tag = await Tag.findOne({
    where: { id: tagId },
    include: [Product]
  });
  res.send(tag);
  } catch (err) {
    console.error('Could not retrieve tag', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body;

    const newTag = await Tag.create({
      tag_name,
    });
    res.send(newTag);
  } catch (err) {
    console.error('Could not create Tag', err)
    res.status(500).json({ error: 'Internal Server Error'})
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const { tag_name } = req.body;

    const newTag = await Tag.update(
      { tag_name: tag_name },
      { where: { id: tagId } }
    );
    res.json(newTag);
  } catch (err) {
    console.error('Could not update Tag', err)
    res.status(500).json({ error: 'Internal Server Error'})
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const deleted = await Tag.destroy({
      where: { id: tagId }
    })
    res.json(deleted);
  }catch (err) {
    console.error('Those who can destroy a thing truly posses it.', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

module.exports = router;
