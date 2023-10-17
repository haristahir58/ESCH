import React, { useEffect, useState } from 'react';
import '../Sidebar/DisSidebar.scss';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../../../context/darkModeContext';
import { useContext } from 'react';

const DisSidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [userData, setUserData] = useState(null);

  const callHomePage = async () => {
    try {
      const res = await fetch('/distributor/profile', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      console.log(data);
      setUserData(data);

      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }
    } catch (err) {
      console.log(err);
      // navigate("/user/login");
    }
  };

  useEffect(() => {
    callHomePage();
  }, []);

  return (
    <div className="sidebarDis">
      <div className="topDis">
        <Link to="/distributor" style={{ textDecoration: 'none' }}>
        <i className="fa fa-user icon1" style={{color: "#107b9f"}}></i><span className="logo1">Distributor Dashboard</span>
        </Link>
      </div>
   
      <div className="centerDis">
        <ul>
          <p className="titleDis">MAIN</p>
          <Link to="/distributor" style={{ textDecoration: 'none' }}>
            <li>
            <i className="fa fa-home icon1"></i>
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="titleDis">LISTS</p>
          <Link to="/distributor/request/new" style={{ textDecoration: 'none' }}>
            <li>
              <i className="fa fa-user icon1"></i>
              <span>Join Distribution Team</span>
            </li>
          </Link>

          <Link to="/distributor/requests" style={{ textDecoration: 'none' }}>
            <li>
              <i className="fas fa-chart-line icon1"></i>
              <span>Request Status</span>
            </li>
          </Link>

          <Link to="/distributor/products" style={{ textDecoration: 'none' }}>
            <li>
            <i className="fa fa-shopping-bag icon1"></i>
              <span>Products</span>
            </li>
          </Link>

            <li>
            <i className="fa fa-shopping-bag icon1"></i>
              <span>Sales Team</span>
            </li>


          <p className="titleDis">USEFUL</p>
          <li>
            <i className="fas fa-chart-bar icon1"></i>
            <span>Report</span>
          </li>

          <li>
            <i className="fa fa-bell icon1"></i>
            <span>Notifications</span>
          </li>
          <p className="titleDis">SERVICE</p>
          <li>
            <i className="fa fa-truck icon1"></i>
            <span>Orders</span>
          </li>

          <li>
            <i className="fa fa-shopping-cart icon1"></i>
            <span>View Complains</span>
          </li>

          <p className="titleDis">USER</p>

          <Link to={`/distributor/profile/${userData && userData._id}`}>
          <li>
            <i className="fa fa-user-circle icon1"></i>
            <span>Profile</span>
          </li>
          </Link>

            <Link to={'/distributor/logout'} style={{ textDecoration: 'none' }}>
            <li>
              <i className="fas fa-sign-out-alt icon1"></i>
              <span>Logout</span>
            </li>
            </Link>

        </ul>
      </div>
      <div className="bottomDis">
        <div className="colorOption1" onClick={() => dispatch({ type: 'LIGHT' })}></div>
        <div className="colorOption1" onClick={() => dispatch({ type: 'DARK' })}></div>
      </div>
    </div>
  );
};

export default DisSidebar;
