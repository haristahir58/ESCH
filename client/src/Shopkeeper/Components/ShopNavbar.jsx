import React,{useState} from 'react';
import { Link, NavLink } from "react-router-dom";
import './Style/Navbar.css'; 
import LuckStoreImg from '../../Images/luckystore.png'
import Cart from '../../Images/cart.png'
import Background from '../../Images/background.png'

const ShopNavbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  const [isOpen2, setIsOpen2] = useState(false);

  const handleMouseEnter2 = () => {
    setIsOpen2(true);
  };

  const handleMouseLeave2 = () => {
    setIsOpen2(false);
  };

  return (
    <header>
      <div className="container">
        <div className="navbar-6">
          <div className="logo-6">
            <p>Smart <span className='span2'>POS <img src={Cart} width="30px" height="30px" alt="Cart" /></span></p>
          </div>
          <nav className='nav-33'>
            <ul id="MenuItems">
              <li><Link to="/shopkeeper" style={{textDecoration:'none',color:'black',fontSize:'18px'}}>Home</Link></li>
              <li><Link to="/shopkeeper/cart" style={{textDecoration:'none',color:'black',fontSize:'18px'}}>Cart</Link></li>
              <li><Link to="/shopkeeper/complain" style={{textDecoration:'none',color:'black',fontSize:'18px'}}>Add Complain</Link></li>
              <li><Link to="/shopkeeper/view-complain" style={{textDecoration:'none',color:'black',fontSize:'18px'}}>View Complain</Link></li>
              <li><Link to="/shopkeeper/logout" style={{textDecoration:'none',color:'black',fontSize:'18px'}}>Logout</Link></li>

            </ul>
          </nav>
    

        </div>

      </div>
    </header>
  );
}

export default ShopNavbar;
