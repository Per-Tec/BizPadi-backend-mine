const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller');


// Create sale Route
/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - customer_name
 *               - quantity
 *               - total_price
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: UUID of the product being sold
 *               customer_name:
 *                 type: string
 *                 description: Name of the customer
 *               quantity:
 *                 type: integer
 *                 description: Quantity of product sold
 *               total_price:
 *                 type: number
 *                 description: Total price of the sale
 *     responses:
 *       201:
 *         description: Sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 sale:
 *                   $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', salesController.createSale);



// Get all sales Route
/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales with pagination and optional search
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name or product name
 *     responses:
 *       200:
 *         description: A list of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *       500:
 *         description: Server error
 */
router.get('/', salesController.getAllSales);

// Get sale by ID Route
/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get a sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the sale
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Server error
 */
router.get('/:id', salesController.getSaleById);

// Delete sale by ID Route

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the sale
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', salesController.deleteSale);

// Update sale by ID
/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update a sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the sale to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Sale data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               total_price:
 *                 type: number
 *             example:
 *               product_id: "1b2c3d4e-5678-90ab-cdef-1234567890ab"
 *               quantity: 2
 *               total_price: 4000
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found or no changes made
 *       500:
 *         description: Server error
 */
router.put('/:id', salesController.updateSale);


module.exports = router;
