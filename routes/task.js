const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.use(express.json());

router.get('/', taskController.getAll);
router.get('/:id', taskController.getByID);
router.post('/', taskController.create);
router.post('/:id', taskController.updateByID);
router.delete('/:id', taskController.deleteByID);

module.exports = router;