const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../../model/order/orderModel');
const Product = require('../../../Admin/model/Products/productSchema'); 
const Sole = require('../../model/soleLogin/soleSchema') 
const Sell = require('../../model/Sell/sellSchema')
const Distributor = require('../../model/Distributor/disSchema')
const authenticate = require('../../middleware/authenticate')


router.post('/soleDistributor/sell-product', authenticate, async (req, res) => {
    try {
        const { distributorId, productId, quantity, price } = req.body;
        const userId = req.userId; // Get the ID of the sole distributor from the authentication middleware

        // Check if the sole distributor exists and is authorized
        const soleDistributor = await Sole.findById(userId);

        if (!soleDistributor) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if the product exists and has enough quantity in the sole distributor's inventory
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient inventory' });
        }

        // Calculate the total price for the sale
        const total = price * quantity;

        // Create a new sell record
        const sell = new Sell({
            userId,
            distributorId,
            product: productId,
            quantity,
            price,
            status: 'pending',
        });

        // Save the sell record
        await sell.save();

        // Update the product's quantity in the sole distributor's inventory
        // product.quantity -= quantity;
        // await product.save();

        // Find the accepted order for the sole distributor
        const order = await Order.findOne({
            userId: userId,
            status: 'accepted',
            'orderItems.product': productId,
        });

        if (order) {
            // Update the quantity in the order
            const orderItem = order.orderItems.find((item) => item.product == productId);
            if (orderItem) {
                orderItem.quantity -= quantity;
                await order.save();
            }
        }

        res.json({ message: 'Product sold successfully' });
    } catch (error) {
        console.error('Error selling product:', error);
        res.status(500).json({ message: 'Error selling product' });
    }
});





router.get('/soleDistributor/sold-products', authenticate, async (req, res) => {
    try {
        const userId = req.userId; // Get the ID of the sole distributor from the authentication middleware

        // Find the products sold by the sole distributor and populate 'product' and 'distributorId' fields
        const soldProducts = await Sell.find({ userId })
            .populate('product') // Populate 'product' field
            .populate('distributorId'); // Populate 'distributorId' field

        // Now, you can use the populated data
        const productsWithDetails = soldProducts.map((soldProduct) => {
            return {
                _id: soldProduct._id,
                product: {
                    title: soldProduct.product.title,
                    description: soldProduct.product.description,
                    imageUrl: soldProduct.product.imageUrl
                },
                quantity: soldProduct.quantity,
                price: soldProduct.price,
                distributorId: {
                    name: soldProduct.distributorId.name,
                    // Add more distributor details here as needed
                },
                date: soldProduct.date,
                status: soldProduct.status,
            };
        });

        res.json(productsWithDetails);
    } catch (error) {
        console.error('Error fetching sold products:', error);
        res.status(500).json({ message: 'Error fetching sold products' });
    }
});


// Import your necessary modules and models here
router.get('/soleDistributor/sold-products/:id', authenticate, async (req, res) => {
    try {
        const userId = req.userId; // Get the ID of the sole distributor from the authentication middleware

        // Find the product sold by the sole distributor with the specified _id and userId and populate 'product' and 'distributorId' fields
        const soldProduct = await Sell.findOne({ _id: req.params.id, userId: userId })
            .populate('product') // Populate 'product' field
            .populate('distributorId'); // Populate 'distributorId' field

        if (!soldProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Now, you can use the populated data
        const productWithDetails = {
            _id: soldProduct._id,
            product: {
                title: soldProduct.product.title,
                description: soldProduct.product.description,
                imageUrl: soldProduct.product.imageUrl
            },
            quantity: soldProduct.quantity,
            price: soldProduct.price,
            distributorId: {
                name: soldProduct.distributorId.name,
                // Add more distributor details here as needed
            },
            date: soldProduct.date,
            status: soldProduct.status,
        };

        res.json(productWithDetails);
    } catch (error) {
        console.error('Error fetching sold product:', error);
        res.status(500).json({ message: 'Error fetching sold product' });
    }
});




  


  
module.exports = router;
