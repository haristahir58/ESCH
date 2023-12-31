import React, { useEffect, useState } from 'react';
import "./widget.scss";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";

const Widget = ({ type }) => {
  const [productCount, setProductCount] = useState();
  const [orderCount, setOrderCount] = useState();
  const [soleCount, setSoleCount] = useState();
  const [soleAuthCount, setSoleAuthCount] = useState();
  const [sales, setSales] = useState();
  const diff = 20;

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const productResponse = await fetch('/admin/products');
      const productData = await productResponse.json();
      setProductCount(productData.length);

      const soleResponse = await fetch('/admin/users');
      const soleData = await soleResponse.json();
      setSoleCount(soleData.length);

      const soleAuthResponse = await fetch('/soleDistributor');
      const soleAuthData = await soleAuthResponse.json();
      setSoleAuthCount(soleAuthData.length);

      // Fetch order count
      const orderResponse = await fetch('/admin/orders');
      const orderData = await orderResponse.json();
      setOrderCount(orderData.length);

      // Fetch sales
      const salesResponse = await fetch('/admin/sales');
      console.log('Sales response:', salesResponse);
      const salesData = await salesResponse.json();
      setSales(salesData.acceptedOrdersCount);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  let data;

  switch (type) {
    case "user":
      data = {
        title: "SOLE DISTRIBUTORS",
        count: soleCount + soleAuthCount,
        isMoney: false,
        link: <Link to={'/admin/users'}>"See all users"</Link>,
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "NEW ORDERS",
        isMoney: false,
        count: orderCount, // Display order count
        link: <Link to={'/admin/order'}>"View all orders"</Link>, // Link to the orders page
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "sales":
      data = {
        title: "SALES",
        isMoney: true,
        count: sales,
        link: "View sales",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "products":
      data = {
        title: "PRODUCTS",
        count: productCount,
        isMoney: true,
        link: <Link to={'/admin/products'}>"See all Products"</Link>,
        icon: (
          <LocalMallIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    case "soleDistributors":
      data = {
        title: "SOLE DISTRIBUTORS",
        count: soleCount,
        isMoney: true,
        link: "See details",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              color: "crimson",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {typeof data.count === "undefined" ? "N/A" : (data.isMoney ? `${data.count}` : data.count)}
        </span>
        <span className="link">{data.link}</span>
      </div>

      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpRoundedIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
