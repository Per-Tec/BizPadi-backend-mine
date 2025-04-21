const Sale = require('../models/sales');
const  Product  = require('../models/product');
// const { User } = require('../models/user');

const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

exports.createSale = async (req, res) => {
  try {
    const { user_id, product_id, quantity, price } = req.body;

    // Check if product exists
    const product = await Product.findByPk(user_id, product_id); 
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Optional: Check if quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient product stock' });
    }

    const total_price = Number(selling_price) * Number(quantity);
    profit = selling_price - product.cost_price * quantity; // Implement this logic
    // Update product stock
    product.quantity -= quantity;
    await product.save();

    // Create sale
    const sale = await Sale.create({
      sale_id: uuidv4(),
      product_id,
      quantity,
      total_price : Number(total_price),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Sale recorded successfully', sale });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to record sale', details: error.message });
  }
};

exports.getAllSales = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;
  
      const { count, rows } = await Sale.findAndCountAll({
        where: {
          [Op.or]: [
            { '$Product.name$': { [Op.iLike]: `%${search}%` } }
          ]
        },
        include: [{ model: Product }],
        offset: parseInt(offset),
        limit: parseInt(limit),
      });
  
      res.status(200).json({
        success: true,
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        data: rows,
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ error: 'Failed to fetch sales' });
    }
  };
  
exports.getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id, { where: { sale_id: id } , include: [{model: Product}] });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Sale.destroy({ where: { sale_id: id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, quantity } = req.body;

    // Find existing sale by sale_id (UUID)
    const sale = await Sale.findOne({ where: { sale_id: id } });
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
    const total_price = product.price * quantity;

    // Update the sale
    await sale.update({
      product_id,
      quantity,
      total_price,
      updated_at: new Date(),
    });

    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Failed to update sale', details: error.message });
  }
};

