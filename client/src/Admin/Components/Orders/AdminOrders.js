import React, { useState, useEffect } from 'react';
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";


const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend
    fetch('/admin/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const handleAcceptOrder = (orderId) => {
    // Send a PUT request to accept the order
    fetch(`/admin/orders/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'accept' }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Update the order status in the local state
          const updatedOrders = orders.map((order) =>
            order._id === orderId ? { ...order, status: 'accepted' } : order
          );
          setOrders(updatedOrders);
        }
      })
      .catch((error) => console.error('Error accepting order:', error));
  };

  const handleRejectOrder = (orderId) => {
    // Send a PUT request to reject the order
    fetch(`/admin/orders/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'reject' }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Update the order status in the local state
          const updatedOrders = orders.map((order) =>
            order._id === orderId ? { ...order, status: 'rejected' } : order
          );
          setOrders(updatedOrders);
        }
      })
      .catch((error) => console.error('Error rejecting order:', error));
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
                  <label>Email<div className="order-email">{order.distributor.email}</div></label>
                  <label>Address<div className="order-address">{order.address}</div></label>
                  <label>Date<div className="order-date">{new Date(order.Date).toLocaleDateString()}</div></label>
                </div>
                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item-details">
                      <div className="product-title">{item.product}</div>
                      <div className="quantity">Quantity: {item.quantity}</div>
                      <div className="quantity">Price: {item.total}</div>
                    </div>
                  ))}
                </div>
                <div className="order-action">
                  {order.status === 'accepted' ? (
                    <span className="status accepted">Accepted</span>
                  ) : order.status === 'rejected' ? (
                    <span className="status rejected">Rejected</span>
                  ) : (
                    <>
                      <button
                        className="Button accept-button"
                        onClick={() => handleAcceptOrder(order._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="Button reject-button"
                        onClick={() => handleRejectOrder(order._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrder;
