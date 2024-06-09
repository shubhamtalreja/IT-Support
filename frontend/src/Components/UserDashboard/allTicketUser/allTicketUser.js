import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import CustomTable from "../../CustomTable/CustomTable";

const AllTicketUser = () => {
  const [tickets, setTickets] = useState([]);
  const baseUrl = baseURL.baseUrl;
  const navigate = useNavigate();

  if (!Cookies.get("token")) {
    navigate("/");
  }

  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken;
  // const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);

  const employeeID = user.employeeID;
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/ticket/userticket?employeeID=${employeeID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      setTickets(data);
      // setFormData({
      //   ...formData,
      //   Status: "open",
      // });
      setLoading(false);
    } catch (err) {
      console.log(err);
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
      { label: "Created On", column: "createdOn" },
      { label: "Priority", column: "priority" },
      { label: "Status", column: "status" },
    ];
  };
  return (
    <div className="wrapperDiv previousTickits">
      <div className="container">
        <div className="Heading">All Tickets User</div>

        <CustomTable tickets={tickets} columns={generateColumnsArray()} />
      </div>
    </div>
  );
};

export default AllTicketUser;
