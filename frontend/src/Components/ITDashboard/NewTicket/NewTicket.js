import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import baseURL from "../../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import CustomTable from "../../CustomTable/CustomTable";

const NewTicket = () => {
  const baseUrl = baseURL.baseUrl;
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  if (!Cookies.get("token")) {
    navigate("/");
  }

  const fetchData = async () => {
    setLoading(true);
    fetch(`${baseUrl}/ticket/ticket`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        // setFormData({
        //   ...formData,
        //   Status: "open",
        // });
        setLoading(false);
      })
      .catch((err) => console.log(err));
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
    <div className="wrapperDiv previousTickits">
      <div className="container">
        <div className="Heading">New Tickets</div>
        <CustomTable tickets={tickets} columns={generateColumnsArray()} />
      </div>
    </div>
  );
};
export default NewTicket;
