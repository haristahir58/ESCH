import React, { useState, useEffect } from "react";
import Navbar from "./ShopNavbar";
import Footer from "./ShopFooter";
import "./Style/Home.css";

export default function ShopHome() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch('/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <>
        <Navbar />
        <div className="small-container">
          <div className="row">
            {products.map((item) => (
              <div key={item._id} className="col-4">
                <img src={`http://localhost:4000/${item?.imageUrl}`} alt={item.title} />
                <h4>{item.title}</h4>
                <div className="rating">
                  <i className="fa fa-star" aria-hidden="true" />
                  <i className="fa fa-star" aria-hidden="true" />
                  <i className="fa fa-star" aria-hidden="true" />
                  <i className="fa fa-star" aria-hidden="true" />
                  <i className="fa fa-star-o" aria-hidden="true" />
                </div>
                <p className="price-shop">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </>
      <Footer />
    </div>
  );
}
