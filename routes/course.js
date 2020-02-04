const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.use(express.json());

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);
router.post('/', courseController.create);
router.post('/:id', courseController.updateById);
router.delete('/:id', courseController.deleteById);

module.exports = router;
