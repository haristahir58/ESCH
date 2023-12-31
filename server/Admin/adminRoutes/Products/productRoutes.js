const express = require('express');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const Category = require('../../model/Products/categorySchema')
const router = express.Router();
require('../../../db/conn');
const Products = require('../../model/Products/productSchema')



//For Adding the product we will use router.post
router.post('/admin/products/new', upload.single('image'), async (req,res)=>{
  console.log(req.file, req.body, 42);
    const { title, description, price,quantity} = req.body;
    const imageUrl = req.file.path;
    const categoryId = req.body.categoryId; // Assuming categoryId is present in the request body
    if (!title|| !categoryId || !imageUrl || !description || !price || !quantity){
        return res.status(422).json({error: "Please fill the field properties"});
    }
    try {
      // Check if the specified category exists
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
          return res.status(404).json({ message: 'Category not found' });
      }

      // Create a new product
      const product = new Products({
          title,
          category: categoryId, // Assign the category ID directly
          description,
          price,
          quantity,
          imageUrl,
      });

      await product.save();

      // Push the new product's ID to the 'products' array in the associated category
      existingCategory.products.push(product._id);
      await existingCategory.save();

      res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
      console.error(err); // Log the error to the console
res.status(400).json({ message: err.message });
  }
});


//For Getting the all products data we will use router.get
router.get('/admin/products',async(req,res)=>{
    try{
    const product = await Products.find();
    res.json(product);
    } catch(err){
      res.status(500).json({message:"Cant Find Products"})
    }
  })

  //For Getting Specific Product's data 
router.get('/admin/products/:id', async (req, res) => {
    try {
      const product = await Products.findOne({ _id: req.params.id });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Can't find Products" });
    }
  });

// For Updating Specific product's data with put method
router.put('/admin/products/:id', upload.single('image'), async (req, res) => {
  const { title, description, price, quantity } = req.body;
  const categoryId = req.body.categoryId; // Assuming categoryId is present in the request body

  try {
      // Check if the specified category exists
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
          return res.status(404).json({ message: 'Category not found' });
      }

      // Find the product by ID
      const productId = req.params.id;
      const existingProduct = await Products.findById(productId);

      if (!existingProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Update the product data
      existingProduct.title = title;
      existingProduct.category = categoryId;
      existingProduct.description = description;
      existingProduct.price = price;
      existingProduct.quantity = quantity;

      // Conditionally update the image field if an image is provided in the request
      if (req.file) {
          existingProduct.imageUrl = req.file.path;
      }

      await existingProduct.save();

      res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
  }
});



  //For Deleting Specific product's data with delete method
router.delete('/admin/products/:id', async (req, res) => {
    try {
      const product = await Products.findOneAndDelete(
        { _id: req.params.id },
        req.body
      );
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Can't Delete product" });
    }
  })





module.exports = router;