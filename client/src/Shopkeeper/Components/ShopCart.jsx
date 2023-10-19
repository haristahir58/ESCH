import React from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "./ShopNavbar";
import Footer from "./ShopFooter";
import Iphone14 from "../../Images/prod1-apple-iphone-14-pro-max.jpg";
import cannon90D from "../../Images/prod3-cannon-90D.jpg";
import AppleMacBookPro16 from "../../Images/prod10-Apple-MacBook-Pro-16-inches.jpg";
import "./Style/Cart.css";


const ShopCart = () => {

 

  return (
    <>
    <Navbar />
    <div class="small-container cart-page">
      <table className="table34">
        <tr>
          <th className="th-2">Product</th>
          <th className="th-2">Quantity</th>
          <th className="th-2">Subtotal</th>
        </tr>

        <tr>
          <td className="td-2">
            <div class="cart-info">
              <img
                src={Iphone14}
                alt=""
              />
              <div>
                <p>Apple Iphone 14 Pro Max</p>
                <small>Price: Rs.470,000 </small>
                <br />
                <a href="">Remove</a>
              </div>
            </div>
          </td>
          <td className="td-2"><input type="number" value="1" /></td>
          <td className="td-2">Rs.470,000</td>
        </tr>

        <tr>
          <td className="td-2">
            <div class="cart-info">
              <img src={cannon90D} alt="" />
              <div>
                <p>Canon 90D DSLR Camera</p>
                <small>Price: Rs.205,000 </small>
                <br />
                <a href="">Remove</a>
              </div>
            </div>
          </td>
          <td className="td-2"><input type="number" value="1" /></td>
          <td className="td-2">Rs.205,000</td>
        </tr>

        <tr>
          <td className="td-2">
            <div class="cart-info">
              <img
                src={AppleMacBookPro16}
                alt=""
              />
              <div>
                <p>Apple MacBook Pro 16</p>
                <small>Price: Rs.419,999 </small>
                <br />
                <a href="">Remove</a>
              </div>
            </div>
          </td>
          <td className="td-2"><input type="number" value="1" /></td>
          <td className="td-2">Rs.419,999</td>
        </tr>
      </table>

      <div class="total-price">
        <table>
          <tr>
            <td className="td-2">Subtotal</td>
            <td className="td-2">Rs.1,094,999</td>
          </tr>

        </table>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default ShopCart;
