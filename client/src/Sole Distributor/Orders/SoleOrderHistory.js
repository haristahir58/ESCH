import React, { useState, useEffect } from 'react';
import Sidebar from "../Components/Sidebar/SoleSidebar";
import Navbar from "../Components/navbar/Navbar";
import './Style/SoleOrder.scss'

const SoleOrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend
    fetch('/soleDistributor/orders/history')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);



  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />

          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <label>Order ID</label><div className="order-id">{order._id}</div>
                  <label>Email</label><div className="order-email">{order.userId.email}</div>
                  <label>Address</label><div className="order-address">{order.address}</div>
                </div>
                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item-details">
                      <div className="product-title">{item.product}</div>
                      <div className="total-price">Total Price: {item.total}</div>
                      <div className="quantity">Quantity: {item.quantity}</div>
                    </div>
                  ))}
                </div>
                <label>Date</label><div className="order-date">
                {new Date(order.Date).toLocaleDateString()}
                </div>
                
                <div className="tableCell" style={{display:"flex", justifyContent:"center"}}>
              <span className={`status ${order.status}`}>{order.status}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SoleOrderHistory;
