const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Product = require('../models/product');
const Sale = require('../models/sales')
//const db = require('../models');
//const { Sale, Product} = require('../models')

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      image_url,
      category
    } = req.body;

    // const user_id = req.user_id;

    const newProduct = await Product.create({
      product_id: uuidv4(), // generate a UUID
      name,
      description,
      price,
      quantity,
      image_url,
      category,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      error: 'Failed to create product',
      details: error.message,
    });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        }
      : {};

    const { rows: products, count: totalItems } = await Product.findAndCountAll({
      where: whereClause,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
  
  // Get product by ID
  exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  };
  
  // Update product
  exports.updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Product.update(req.body, {
        where: { product_id: id },
      });
  
      if (!updated) {
        return res.status(404).json({ error: 'Product not found or no changes made' });
      }
  
      const updatedProduct = await Product.findByPk(id);
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  };
  
  // Delete product
  exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.destroy({ where: { product_id: id } });
  
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  };

  // controllers/product.controller.js

exports.sellProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity provided' });
      }
  
      const product = await Product.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      if (product.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough stock to fulfill the sale' });
      }
      
      // Calculate total price
    const total_price = product.price * quantity;

    // Record the sale
    await Sale.create({
      product_id: id,
      quantity,
      total_price,
      sale_date: new Date(),
    });

      // Update product quantity
      product.quantity -= quantity;
      product.updated_at = new Date();
      await product.save();
  
      res.status(200).json({
        message: 'Product sold successfully',
        product,
      });
    } catch (error) {
      console.error('Error processing sale:', error);
      res.status(500).json({ error: 'Failed to process sale' });
    }
  };
  