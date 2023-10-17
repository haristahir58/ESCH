const express = require('express');
const router = express.Router();
const authenticate = require("../../middleware/authenticate")
const Request = require('../../model/request/requestModel')


router.post('/distributor/request/new', authenticate, async (req, res) => {
    try {
      const { experience } = req.body;
      const userId = req.userId; // Extracted from authentication middleware
  
      if (!experience) {
        return res.status(422).json({ message: "Please select Experience" });
      }
  
      // Check if there is an existing request with 'pending' or 'rejected' status
      const existingRequest = await Request.findOne({ userId, status: { $in: ['pending', 'rejected'] }});
  
      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          return res.status(400).json({ error: 'You already have a pending request.' });
        } else if (existingRequest.status === 'rejected') {
          // Define the new request object here to make it accessible in both branches
          const newRequest = new Request({
            userId,
            requestDate: new Date(),
            experience,
            status: 'pending',
          });
  
          // Save the request to the database
          const savedRequest = await newRequest.save();
  
          return res.status(201).json(savedRequest);
        }
      }
  
      // Create a new request with the current date as requestDate
      const newRequest = new Request({
        userId,
        requestDate: new Date(),
        experience,
        status: 'pending',
      });
  
      // Save the request to the database
      const savedRequest = await newRequest.save();
  
      res.status(201).json(savedRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.get('/distributor/request', authenticate, async (req, res) => {

    try {
      const userId = req.userId; 
      const request = await Request.find({ userId }).populate('userId'); 
      if (!request) {
        return res.status(404).json({ error: "Can't find requests" });
      }
      res.json(request);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });




  module.exports = router;