const express = require("express");
const router = express.Router();
const salesController = require("../controllers/sales.controller");
const { authenticate } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         sale_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         product_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         quantity:
 *           type: integer
 *           example: 2
 *         selling_price:
 *           type: number
 *           format: float
 *           example: 2000.00
 *         total_price:
 *           type: number
 *           format: float
 *           example: 4000.00
 *         profit_made:
 *           type: number
 *           format: float
 *           example: 1000.00
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-04-18T14:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-04-18T14:30:00Z"
 *       required:
 *         - product_id
 *         - quantity
 *         - selling_price
 *     SaleUpdate:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 3
 *         price:
 *           type: number
 *           format: float
 *           example: 2500.00
 *         customer_name:
 *           type: string
 *           example: "Jane Doe"
 */

// Create sale Route
/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *               - selling_price
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: UUID of the product being sold
 *               quantity:
 *                 type: integer
 *                 description: Quantity of product sold
 *               selling_price:
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
router.post("/", authenticate, salesController.createSale);

// Get all sales Route
/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales with pagination and optional search
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
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
router.get("/", authenticate, salesController.getAllSales);

// Get sale by ID Route
/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get a sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
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
router.get("/:id", authenticate, salesController.getSaleById);

// Delete sale by ID Route

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
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
router.delete("/:id", authenticate, salesController.deleteSale);

// Update sale by ID
/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update a sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
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
router.put("/:id", authenticate, salesController.updateSale);

module.exports = router;
