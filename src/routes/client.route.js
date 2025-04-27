const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clients.controller');
const { authenticate } = require('../middlewares/auth.middleware')

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         client_id:
 *           type: string
 *           format: uuid
 *           example: 8ac67d3b-642a-4364-9ca4-7d18c7f0569d
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: 7bc67d3b-642a-4364-9ca4-7d18c7f0569e
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         phone_number:
 *           type: string
 *           example: +1234567890
 *         address:
 *           type: string
 *           example: 123 Main Street, Lagos
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2025-04-18T14:30:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2025-04-18T14:30:00Z
 *       required:
 *         - name
 *         - email
 *         - phone_number
 *         - address
 */

// Create client Route
/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []  # Assuming you're using JWT auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone_number
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               phone_number:
 *                 type: string
 *                 example: +1234567890
 *               address:
 *                 type: string
 *                 example: 123 Main Street, Lagos
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client created successfully
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/',authenticate, clientController.createClient);

// Get all clients Route
/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients with pagination and search
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []  # JWT authentication if required
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
 *         description: Number of results per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, email, or phone number
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 42
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 2
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, clientController.getAllClients)


// Get client by ID Route
/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []  # If you're using JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the client to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 8ac67d3b-642a-4364-9ca4-7d18c7f0569d
 *     responses:
 *       200:
 *         description: Successfully retrieved the client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Client not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error fetching client
 */
router.get('/:id', authenticate, clientController.getClientById )


// Update client by ID Route
/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []  # Optional, if you're using JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the client to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 8ac67d3b-642a-4364-9ca4-7d18c7f0569d
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Client Name
 *               email:
 *                 type: string
 *                 example: updated@email.com
 *               phone_number:
 *                 type: string
 *                 example: "+2348012345678"
 *               address:
 *                 type: string
 *                 example: "Updated Address"
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Client updated successfully
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, clientController.updateClientById )


// Delete client by ID Route
/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []  # Optional: only if you're using JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the client to delete
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 8ac67d3b-642a-4364-9ca4-7d18c7f0569d
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Client deleted successfully
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Client not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error deleting client
 */

router.delete('/:id', authenticate, clientController.deleteClientById )

module.exports = router