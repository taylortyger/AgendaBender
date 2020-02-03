const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(express.json());

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.post('/:id', taskController.updateById);
router.delete('/:id', taskController.deleteById);

module.exports = router;
