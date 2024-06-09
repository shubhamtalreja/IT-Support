import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import CustomTable from "../CustomTable/CustomTable";
const OpenTicket = () => {
  const baseUrl = baseURL.baseUrl;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!Cookies.get("token")) {
    navigate("/");
  }

  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken.role;

  const [formData, setFormData] = useState(user);
  const role = user;
  const fetchData = async () => {
    try {
      setLoading(true);
      if (role === "admin" || role === "it") {
        const response = await fetch(`${baseUrl}/ticket/ticketOpen`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        setTickets(data);
        // setFormData({
        //   ...formData,
        //   Status: "open",
        // });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
   const generateColumnsArray = () => {
     return [
       { label: "S.No" },
       { label: "Ticket No" },
       { label: "Title" },
       { label: "Description" },

       { label: "CreatedOn", column: "createdOn" },
       { label: "Reporter" },
       { label: "Updated On", column: "updatedOn" },
       { label: "Priority", column: "priority" },
       { label: "Status", column: "status" },
     ];
   };
  return (
    <>
      <div className="wrapperDiv previousTickits">
        <div className="container">
          <div className="Heading">Open Tickets</div>
          <CustomTable tickets={tickets} columns={generateColumnsArray()} />
        </div>
      </div>
    </>
  );
};

export default OpenTicket;
