import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import CustomTable from "../CustomTable/CustomTable";

const AllTicket = () => {
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  if (!Cookies.get("token")) {
    navigate("/");
  }
  const baseUrl = baseURL.baseUrl;
  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken.role;
  const [formData, setFormData] = useState(user);
  const role = user;

  const fetchData = async () => {
    try {
      setLoading(true);

      if (role === "it") {
        const response = await fetch(`${baseUrl}/ticket/ticketClose`, {
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
      } else if (role === "admin") {
        const response = await fetch(`${baseUrl}/ticket/ticket`, {
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
  const exportTicketDataInExcel = async () => {
    try {
      const response = await fetch(`${baseUrl}/ticket/downloadExcel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ticket_data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="wrapperDiv previousTickits">
        <div className="container">
          <div className="Heading">All Tickets</div>

          <CustomTable
            tickets={tickets}
            columns={generateColumnsArray()}
            exportTicketDataInExcel={exportTicketDataInExcel}
          />
        </div>
      </div>
    </>
  );
};

export default AllTicket;
