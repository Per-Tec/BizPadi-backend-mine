//const db = require('../models'); 
const  Client  = require('../models/clients');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const logger = require('../utils/logger');


exports.createClient = async (req, res) => {
  try {
    logger.info(`START: Attempting to create a new client`);
    const { 
        name, 
        email, 
        phone_number, 
        address 
    } = req.body;
    if(!name || !email || !phone_number || !address) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      };

      const user_id = req.user_id;
      if (!user_id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

    const client = await Client.create({
        client_id: uuidv4(),
        name, 
        email, 
        phone_number, 
        address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user_id, 
    });
    logger.info(`END: Successfully created a new client`);
    res.status(201).json({
      message: 'Client created successfully',
      client: client ,
    });
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    console.error('Error creating client:', error);
    res.status(500).json({
      error: 'Failed to create client',
      details: error.message,
    });
  }
};


exports.getAllClients = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    logger.info(`START: Fetching clients`);

    // Get query params with defaults
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build search condition
    const where = {
      user_id: user_id  // Always filter by user_id
    };
    
    // Add search conditions if search parameter exists
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Client.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No clients found',
      });
    }

    logger.info(`END: Clients fetched successfully`);
    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      clients: rows,
    });
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    console.error('Error fetching clients:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clients',
    });
  }
};

exports.getClientById = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  try {
    logger.info(`START: Fetching client by ID`);

    const { id } = req.params;

    const client = await Client.findOne({ where: { client_id: id, user_id: user_id } });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    logger.info(`END: Client fetched successfully`);
    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    console.error('Error fetching client by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching client',
    });
  }
};


exports.updateClientById = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  try {
    logger.info(`START: Updating client`);

    const { id } = req.params;
    const { name, email, phone_number, address } = req.body;

    const client = await Client.findOne({ where: { client_id: id, user_id: user_id } });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Update fields if provided
    client.name = name ?? client.name;
    client.email = email ?? client.email;
    client.phone_number = phone_number ?? client.phone_number;
    client.address = address ?? client.address;
    client.updated_at = new Date().toISOString();

    await client.save();

    logger.info(`END: Client updated successfully`);
    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      client,
    });
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    console.error('Error updating client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating client',
    });
  }
};


exports.deleteClientById = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  try {
    logger.info(`START: Deleting client`);

    const { id } = req.params;

    const client = await Client.findOne({ where: { client_id: id, user_id: user_id } });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    await client.destroy();

    logger.info(`END: Client deleted successfully`);
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    console.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting client',
    });
  }
};
