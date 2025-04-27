const Sale = require('../models/sales');
const Product = require('../models/products');
// const { User } = require('../models/user');

const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { log } = require('winston');

exports.createSale = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const {product_id, quantity,  selling_price } = req.body;
    if (!product_id || !quantity || !selling_price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if product exists
    const product = await Product.findOne({
      where: { product_id: product_id, user_id: user_id },
    })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Optional: Check if quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient product stock' });
    }

    const total_price = Number(selling_price) * Number(quantity);
    const profit_made = total_price - (product.cost_price * quantity);
    // Update product stock
    product.quantity -= quantity;
    await product.save();

    // Create sale
    const sale = await Sale.create({
      sale_id: uuidv4(),
      product_id,
      quantity,
      total_price : Number(total_price),
      cost_price : product.cost_price,
      selling_price : Number(selling_price),
      profit_made : Number(profit_made),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user_id,
    });

    res.status(201).json({ message: 'Sale recorded successfully', sale });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to record sale', details: error.message });
  }
};

exports.getAllSales = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
    try {
      logger.info(`START: Attempting to fetch all sales`);
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;
      if(limit > 20) {
        return res.status(400).json({
          success: false,
          message: 'Limit cannot be greater than 20',
        });
      }  
  
      const { count, rows } = await Sale.findAndCountAll({
        where: {
          [Op.or]: [
            { '$Product.name$': { [Op.iLike]: `%${search}%` } }
          ],
          user_id: user_id,
        },
        include: [{ model: Product }],
        offset: parseInt(offset),
        limit: parseInt(limit),
      });
      if (count === 0) {
        return res.status(404).json({ error: 'No sales found' });
      }
      //Total sales amount
      const totalSales = rows.reduce((acc, sale) => acc + sale.total_price, 0);
      //Total profit made
      const totalProfit = rows.reduce((acc, sale) => acc + sale.profit_made, 0);

      logger.info(`END: Successfully fetched all sales`);

      res.status(200).json({
        success: true,
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        data: rows,
        totalSales: totalSales,
        totalProfit: totalProfit,
      });
    } catch (error) {
      logger.error(`ERROR: ${error.message}`);
      console.error('Error fetching sales:', error);
      res.status(500).json({ error: 'Failed to fetch sales' });
    }
  };

exports.getSaleById = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Sale ID is required' });
  }
  try {
    logger.info(`START: Attempting to fetch sale with ID: ${id}`);
    const sale = await Sale.findOne({ where: { sale_id: id, user_id: user_id } , include: [{model: Product}] });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
   logger.info(`END: Successfully fetched sale with ID: ${id}`);
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
};

exports.deleteSale = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Sale ID is required' });
  }
  try {
    logger.info(`START: Attempting to delete sale with ID: ${id}`);
    // Revert stock of the product
    const sale = await Sale.findOne({ where: { sale_id: id } });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    const product = await Product.findByPk(sale.product_id);
    if (product) {
      product.quantity += sale.quantity;
      await product.save();
    }

    const deleted = await Sale.destroy({ where: { sale_id: id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    logger.info(`END: Successfully deleted sale with ID: ${id}`);
    res.status(200).json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
};

exports.updateSale = async (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Sale ID is required' });
  }

  const { product_id, quantity, selling_price } = req.body;
  if (!product_id || !quantity || !selling_price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    logger.info(`START: Attempting to update sale with ID: ${id}`);


    // Find existing sale by sale_id (UUID)
    const sale = await Sale.findOne({ where: { sale_id: id, user_id: user_id } });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Find the new product
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Revert stock of previous product
    const previousProduct = await Product.findByPk(sale.product_id);
    if (previousProduct) {
      previousProduct.quantity += sale.quantity;
      await previousProduct.save();
    }

    // Check if new quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient product stock' });
    }

    // Deduct new quantity
    product.quantity -= quantity;
    await product.save();

    // Recalculate total_price
    const total_price = Number(selling_price) * Number(quantity);
    const profit_made = total_price - (product.price * quantity);

    // Update the sale
    await sale.update({
      product_id,
      quantity,
      total_price: Number(total_price),
      profit_made: Number(profit_made),
      cost_price: product.price,
      selling_price: Number(selling_price),
      updated_at: new Date().toISOString(),
    });
    logger.info(`END: Successfully updated sale with ID: ${id}`);
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    logger.error(`ERROR: ${error.message}`);
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Failed to update sale', details: error.message });
  }
};

