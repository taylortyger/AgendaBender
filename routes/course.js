const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.use(express.json());

router.get('/', courseController.getAll);
router.get('/:id', courseController.getByID);
router.post('/', courseController.create);
router.post('/:id', courseController.updateByID);
router.delete('/:id', courseController.deleteByID);

module.exports = router;
