import React, { useEffect, useState } from 'react';
import Sidebar from "../Components/Sidebar/SoleSidebar";
import Navbar from "../Components/navbar/Navbar";

const ViewRequests = () => {
  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/soleDistributor/distributors", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 200) {
          const data = await res.json();
          setDistributors(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />

          <table className="table">
            <thead>
              <tr>
                <th className="tableCell">Distributor ID</th>
                <th className="tableCell">Image</th>
                <th className="tableCell">Name</th>
                <th className="tableCell">Email</th>
                <th className="tableCell">City</th>
                <th className="tableCell">Address</th>
                <th className="tableCell">Status</th>
                
              </tr>
            </thead>
            <tbody>
              {distributors.map((row) => (
                <tr key={row._id}>
                  <td className="tableCell">{row._id}</td>
                  <td className="tableCell">
                  <td className="tableCell"><img src={`http://localhost:4000/${row.userId.imageUrl}`} /></td>
                  </td>
                  <td className="tableCell">{row.userId.name}</td>
                  <td className="tableCell">{row.userId.email}</td>
                  <td className="tableCell">{row.userId.city}</td>
                  <td className="tableCell">{row.userId.address}</td>
                  <td className="tableCell">
                    <span className={`status ${row.status}`}>{row.status}</span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewRequests;
