import React, { useState, useEffect } from 'react';
import Sidebar from "../Components/Sidebar/SoleSidebar";
import Navbar from "../Components/navbar/Navbar";
import './Style/SoleOrder.scss'

const SoleOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend
    fetch('/soleDistributor/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const handleCancelOrder = (orderId) => {
    // Send a DELETE request to cancel the order
    fetch(`/soleDistributor/orders/${orderId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((response) => {
        if (response.status === 200) {
          // Remove the canceled order from the local state
          setOrders(orders.filter((order) => order._id !== orderId));
        }
      })
      .catch((error) => console.error('Error canceling order:', error));
  };

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
                  <label>Order ID<div className="order-id">{order._id}</div></label>
                  <label>Email<div className="order-email">{order.userId.email}</div></label>
                  <label>Address<div className="order-address">{order.address}</div></label>
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
                <div className="order-date">
                  Date: {new Date(order.Date).toLocaleDateString()}
                </div>
                
                <div className="tableCell">
              <span className={`status ${order.status}`}>{order.status}</span>
                </div>

                <div className="order-action">
                    <button
                      className="Button"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SoleOrders;
