import React from 'react';
import { useCart } from './CartContext';
import './Cart.css'; // Import your CSS file for styling
import Navbar from '../../../Sole Distributor/Components/navbar/Navbar';
import Sidebar from '../../../Sole Distributor/Components/Sidebar/SoleSidebar';

const Cart = () => {
  const { cart, dispatch } = useCart();

  // Function to remove an item from the cart
  const removeFromCart = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  return (

    <div className="list">
    <Sidebar />
    <div className="listContainer">
      <Navbar />
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item._id} className="cart-item">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <span className="cart-item-title">{item.title}</span>
              <span className="cart-item-price">${item.price}</span>
              <span className="cart-item-quantity">Quantity: {item.quantity}</span>
            </div>
            <button
              onClick={() => removeFromCart(item)}
              className="cart-item-remove-button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
    </div>
    </div>
  );
};

export default Cart;
