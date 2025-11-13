const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();

router.get('/trip/:tripId', expenseController.getExpenses);
router.get('/trip/:tripId/stats', expenseController.getExpenseStats);
router.post('/trip/:tripId', expenseController.createExpense);
router.post('/trip/:tripId/bulk', expenseController.bulkCreateExpenses);
router.get('/:id', expenseController.getExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;