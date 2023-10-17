const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../../model/order/orderModel');
const Product = require('../../../Admin/model/Products/productSchema'); 
const authenticate = require('../../middleware/authenticate')

router.post('/soleDistributor/placeOrder',authenticate, async (req, res) => {
    const {address, orderItems } = req.body;
    const userId = req.userId; 
    const newOrder = new Order({userId, address, orderItems, Date: new Date(),status: 'pending', });
  
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      await newOrder.save();
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error placing order:', error); // Log the error
      res.status(500).json({ message: 'Error placing order' });
    }
  });

  // Route to fetch all orders
router.get('/soleDistributor/orders', authenticate, async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('orderItems.product')
        .populate({
          path: 'userId',
          select: 'email name', // Specify the fields to populate
        });
  
      // Map the orders to include product titles and user email and name
      const ordersWithProductTitles = orders.map((order) => ({
        _id: order._id,
        address: order.address,
        Date: order.Date,
        status: order.status,
        userId: {
          email: order.userId.email,
          name: order.userId.name,
        },
        orderItems: order.orderItems.map((item) => ({
          product: item.product.title,
          quantity: item.quantity,
          total: item.total,
        })),
      }));
  
      res.json(ordersWithProductTitles);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  });
  
  

// Cancel Order
router.delete('/soleDistributor/orders/:id',authenticate, async (req, res) => {
  const orderId = req.params.id;
  try {
    const deletedOrder = await Order.findOneAndDelete({ _id: orderId });
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Error canceling order' });
  }
});

// Admin Routes for managing orders Accept or reject

router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: 'userId',
            model: 'Sole Distributors',
            select: 'name email',
        }).populate('orderItems.product');

        // Map the orders to include product titles and distributor's name and email
        const ordersWithProductTitles = orders.map((order) => ({
            _id: order._id,
            address: order.address,
            Date: order.Date,
            status: order.status,
            distributor: {
                name: order.userId.name, // Get the name from the related distributor document
                email: order.userId.email, // Get the email from the related distributor document
            },
            orderItems: order.orderItems.map((item) => ({
                product: item.product.title,
                quantity: item.quantity,
                total: item.total,
            })),
        }));

        res.json(ordersWithProductTitles);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Accept or reject
router.put('/admin/orders/:id', async (req, res) => {
    try {
        const { action } = req.body; // Expect 'action' to be 'accept' or 'reject'
        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (action === "accept") {
            // Check if the order is already accepted or rejected
            if (order.status === 'accepted' || order.status === 'rejected') {
                return res.status(400).json({ error: "Order has already been processed" });
            }

            // Check product quantities
            for (const orderItem of order.orderItems) {
                const { product, quantity } = orderItem;

                const productDoc = await Product.findById(product);

                // Ensure there is enough stock
                if (!productDoc || productDoc.quantity < quantity) {
                    return res.status(400).json({ message: `Insufficient stock for product ${productDoc ? productDoc.title : 'unknown'}` });
                }

                // Subtract ordered quantity from product's quantity
                productDoc.quantity -= quantity;
                await productDoc.save();
            }

            // If all checks pass, mark the order as "accepted"
            order.status = 'accepted';
        } else if (action === "reject") {
            if (order.status === 'accepted' || order.status === 'rejected') {
                return res.status(400).json({ error: "Order has already been processed" });
            }
            // Mark the order as "rejected"
            order.status = 'rejected';
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }

        // Save the updated order to change the status
        await order.save();

        res.json({ message: `Order has been ${action === "accept" ? "accepted" : "rejected"}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error processing order" });
    }
});

// Route to fetch products from the accepted order
// router.get('/soleDistributor/my-products', authenticate, async (req, res) => {
//     try {
//         const userId = req.userId;

//         // Find the accepted orders for the sole distributor
//         const orders = await Order.find({
//             userId: userId,
//             status: 'accepted'
//         }).populate('orderItems.product');

//         // Extract product details from accepted orders
//         const products = [];

//         orders.forEach((order) => {
//             order.orderItems.forEach((orderItem) => {
//                 const { product, quantity } = orderItem;
//                 products.push({ product, quantity });
//             });
//         });

//         // Map the product details to include product titles
//         const productsWithTitles = [];

//         for (const productInfo of products) {
//             const product = await Product.findById(productInfo.product);

//             if (product) {
//                 productsWithTitles.push({
//                     title: product.title,
//                     quantity: productInfo.quantity,
//                     description: product.description,
//                     price: product.price,
//                     category: product.category,
//                     imageUrl: product.imageUrl,
//                 });
//             }
//         }

//         res.json(productsWithTitles);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json({ message: 'Error fetching products' });
//     }
// });


// Route to fetch products from the accepted order
router.get('/soleDistributor/my-products', authenticate, async (req, res) => {
  try {
      const userId = req.userId;

      // Find the accepted orders for the sole distributor
      const orders = await Order.find({
          userId: userId,
          status: 'accepted'
      }).populate('orderItems.product');

      // Create an inventory to keep track of products
      const inventory = {};

      // Update the inventory based on accepted orders
      orders.forEach((order) => {
          order.orderItems.forEach((orderItem) => {
              const { product, quantity } = orderItem;

              // Check if the product is already in the inventory
              if (inventory[product]) {
                  // If found, update the quantity
                  inventory[product].quantity += quantity;
              } else {
                  // If not found, add it to the inventory
                  inventory[product] = {
                      product,
                      quantity,
                  };
              }
          });
      });

      // Map the product details to include product titles
      const productsWithTitles = [];

      for (const productInfo of Object.values(inventory)) {
          const product = await Product.findById(productInfo.product);

          if (product) {
              productsWithTitles.push({
                  title: product.title,
                  quantity: productInfo.quantity,
                  description: product.description,
                  price: product.price,
                  category: product.category,
                  imageUrl: product.imageUrl,
              });
          }
      }

      res.json(productsWithTitles);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
  }
});


// Route to get products with low stock
router.get('/soleDistributor/low-stock', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    // Find the accepted orders for the sole distributor
    const orders = await Order.find({
      userId: userId,
      status: 'accepted',
    }).populate('orderItems.product');

    // Create an inventory to keep track of products
    const inventory = {};

    // Update the inventory based on accepted orders
    orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        const { product, quantity } = orderItem;

        // Check if the product is already in the inventory
        if (inventory[product]) {
          // If found, update the quantity
          inventory[product].quantity += quantity;
        } else {
          // If not found, add it to the inventory
          inventory[product] = {
            product,
            quantity,
          };
        }
      });
    });

    // Map the product details to include product titles and image URLs
    const lowStockItems = [];

    for (const productInfo of Object.values(inventory)) {
      const product = await Product.findById(productInfo.product);

      if (product) {
        const item = {
          title: product.title,
          quantity: productInfo.quantity,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl, // Include the image URL
        };

        lowStockItems.push(item);
      }
    }

    // Detect products with low stock
    const lowStockNotifications = lowStockItems
      .filter((item) => item.quantity <= 1)
      .map((item) => ({
        title: item.title,
        quantity: item.quantity,
        imageUrl: item.imageUrl, // Include the image URL in low stock items
      }));

    res.json(lowStockNotifications);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Error fetching low stock products' });
  }
});





// Earnings
router.get('/admin/earnings', async (req, res) => {
  try {

    // Find the accepted orders for the sole distributor
    const orders = await Order.find({
      status: 'accepted'
    });

    let Total = 0;

    // Calculate total earnings by summing up the total prices of all accepted orders
    orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        Total += orderItem.total;
      });
    });

    res.json({ Total });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ message: 'Error fetching earnings' });
  }
});


// Define a route to get monthly sales data
router.get('/admin/monthlyEarnings', async (req, res) => {
  try {
    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          status: 'accepted',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$Date' }, // Extract year and month
          },
          Total: { $sum: { $sum: '$orderItems.total' } },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          Total: 1,
        },
      },
    ]);

    // Create an array of all months from January to December
    const allMonths = [
      '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
      '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12',
    ];

    // Create a map to store earnings for all months
    const monthlyEarningsMap = new Map();
    for (const month of allMonths) {
      monthlyEarningsMap.set(month, 0);
    }

    // Update the earnings for the months with data
    for (const earningsData of monthlyEarnings) {
      monthlyEarningsMap.set(earningsData.month, earningsData.Total);
    }

    // Convert the map to an array of objects
    const result = Array.from(monthlyEarningsMap, ([month, Total]) => ({ month, Total }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching monthly earnings data:', error);
    res.status(500).json({ message: 'Error fetching monthly earnings data' });
  }
});


// Earnings for today
router.get('/admin/todayEarnings', async (req, res) => {
  try {
    // Find the accepted orders for the sole distributor that have today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set time to start of the next day

    const orders = await Order.find({
      status: 'accepted',
      Date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    let todayEarnings = 0;

    // Calculate total earnings by summing up the total prices of all accepted orders
    orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        todayEarnings += orderItem.total;
      });
    });

    res.json({ todayEarnings });
  } catch (error) {
    console.error('Error fetching today earnings:', error);
    res.status(500).json({ message: 'Error fetching today earnings' });
  }
});

// Earnings for last week
router.get('/admin/lastWeekEarnings', async (req, res) => {
  try {
    // Find the accepted orders for the sole distributor in the last week
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    lastWeekStart.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      status: 'accepted',
      Date: {
        $gte: lastWeekStart,
      },
    });

    let lastWeekEarnings = 0;

    // Calculate total earnings by summing up the total prices of all accepted orders
    orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        lastWeekEarnings += orderItem.total;
      });
    });

    res.json({ lastWeekEarnings });
  } catch (error) {
    console.error('Error fetching last week earnings:', error);
    res.status(500).json({ message: 'Error fetching last week earnings' });
  }
});

// Earnings for last month
router.get('/admin/lastMonthEarnings', async (req, res) => {
  try {
    // Find the accepted orders for the sole distributor in the last month
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      status: 'accepted',
      Date: {
        $gte: lastMonthStart,
      },
    });

    let lastMonthEarnings = 0;

    // Calculate total earnings by summing up the total prices of all accepted orders
    orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        lastMonthEarnings += orderItem.total;
      });
    });

    res.json({ lastMonthEarnings });
  } catch (error) {
    console.error('Error fetching last month earnings:', error);
    res.status(500).json({ message: 'Error fetching last month earnings' });
  }
});





module.exports = router;
