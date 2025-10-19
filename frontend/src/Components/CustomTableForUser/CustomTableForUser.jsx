import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import useDebounce from "../lib/hooks/useDebounce";
export default function CustomTableForUser({ tickets }) {
  const [inputValue, setInputValue] = useState("");
  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken;
  const [formData, setFormData] = useState(user);
  const [currentPage, setCurrentPage] = useState(0);
  const ticketsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState({
    createdOn: "asc",
    updatedOn: "asc",
    priority: "asc",
    status: "asc",
  });
  const [column, setColumn] = useState("");
  const employeeID = user.employeeID;
  const handleSort = (column) => {
    setSortOrder((prevSortOrder) => ({
      ...prevSortOrder,
      [column]: prevSortOrder[column] === "asc" ? "desc" : "asc",
    }));
    setColumn(column);
  };

  const renderSortArrow = (column) => {
    if (sortOrder[column] === "asc") {
      return <i className="fa fa-long-arrow-up" />;
    } else {
      return <i className="fa fa-long-arrow-down" />;
    }
  };

  const compareDates = (dateA, dateB, column) => {
    const ymdDateA =
      dateA.date.split("/").reverse().join("-") +
      " " +
      dateA.time.split("/").reverse().join("-");
    const ymdDateB =
      dateB.date.split("/").reverse().join("-") +
      " " +
      dateB.time.split("/").reverse().join("-");
    if (sortOrder[column] === "asc") {
      return ymdDateA.localeCompare(ymdDateB);
    } else {
      return ymdDateB.localeCompare(ymdDateA);
    }
  };
  const comparePriority = (priorityA, priorityB, column) => {
    const priorityOrder = {
      High: 0,
      Medium: 1,
      Low: 2,
    };
    if (sortOrder[column] === "asc") {
      return priorityOrder[priorityA] - priorityOrder[priorityB];
    } else {
      return priorityOrder[priorityB] - priorityOrder[priorityA];
    }
  };

  const compareStatus = (statusA, statusB, column) => {
    const statusOrder = ["Open", "In progress", "Resolve", "Close"];

    if (sortOrder[column] === "asc") {
      return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
    } else {
      return statusOrder.indexOf(statusB) - statusOrder.indexOf(statusA);
    }
  };
  const ticketformArray = tickets.map((item) => item.ticketform);
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const applySearchFilter = (ticket) => {
    if (!debouncedSearchTerm) {
      return true;
    }

    return (
      (ticket.reporter?.name?.toLowerCase() || "").includes(
        debouncedSearchTerm.toLowerCase()
      ) ||
      (ticket.ticketform?.title?.toLowerCase() || "").includes(
        debouncedSearchTerm.toLowerCase()
      ) ||
      (ticket.ticketform?.description?.toLowerCase() || "").includes(
        debouncedSearchTerm.toLowerCase()
      )
    );
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
    setCurrentPage(0);
  };

  const filteredTickets = tickets.filter(applySearchFilter);
  const pageCount = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <>
      <div className="table-responsive">
        <div className="input-group mb-3">
          <div className="searchInputDiv">
            <input
              type="text"
              className="form-control searchInput"
              placeholder="Search"
              value={inputValue}
              onChange={handleSearchChange}
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        {loading ? (
          <div
            className="spinner-border text-danger"
            role="status"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : filteredTickets?.length > 0 ? (
          <table className="table table-bordered common-Table">
            <thead className="Heading">
              <tr>
                <th style={{ color: "black" }}>S.no</th>
                <th style={{ color: "black" }}>Ticket No</th>
                <th style={{ color: "black" }}>Title</th>
                <th style={{ color: "black" }}>Description</th>
                <th style={{ color: "black" }}>
                  <div
                    className="table-header priority"
                    onClick={() => handleSort("priority")}
                  >
                    Priority
                    {renderSortArrow("priority")}
                  </div>
                </th>
                <th style={{ color: "black" }}>
                  <div
                    className="table-header createdon"
                    onClick={() => handleSort("createdOn")}
                  >
                    Created On
                    {renderSortArrow("createdOn")}
                  </div>
                </th>
                <th style={{ color: "black" }}>
                  <div
                    className="table-header status"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {renderSortArrow("status")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets !== undefined &&
              Array.isArray(filteredTickets) &&
              filteredTickets.length > 0
                ? filteredTickets
                    .slice()
                    .sort((a, b) => {
                      switch (column) {
                        case "createdOn":
                          return compareDates(
                            a.created_on,
                            b.created_on,
                            column
                          );
                        case "priority":
                          return comparePriority(
                            a.ticketform?.priority,
                            b.ticketform?.priority,
                            column
                          );
                        case "status":
                          return compareStatus(a.status, b.status, column);
                        default:
                          return 0;
                      }
                    })
                    .map((ticket, index) => {
                      const sNo = currentPage * ticketsPerPage + index + 1;
                      return (
                        <tr
                          className="table-data"
                          key={index}
                          onClick={() =>
                            navigate(
                              `/user/dashboard/previousticket/ticketId/WT${ticket.ticketId}`
                            )
                          }
                        >
                          <td className="view-column" style={{ width: "2px" }}>
                            {sNo}
                          </td>
                          <td className="view-column" style={{ width: "90px" }}>
                            {"WT-"}
                            {ticket.ticketId}
                          </td>
                          <td
                            className="view-column"
                            style={{ width: "200px" }}
                          >
                            {ticket.ticketform?.title
                              ? ticket.ticketform?.title
                              : "-"}
                          </td>
                          <td
                            className="view-column"
                            style={{ width: "300px" }}
                          >
                            {ticket?.ticketform &&
                            ticket.ticketform?.description
                              ? ticket.ticketform?.description?.slice(0, 40) +
                                "..."
                              : "-"}
                          </td>
                          <td className="view-column" style={{ width: "5px" }}>
                            {ticket.ticketform?.priority
                              ? ticket.ticketform?.priority
                              : "-"}
                          </td>
                          <td
                            className="view-column"
                            style={{ width: "200px" }}
                          >
                            {ticket.created_on.date} , {ticket.created_on.time}
                          </td>
                          <td className="view-column" style={{ width: "10px" }}>
                            {ticket.status ? ticket.status : "-"}
                          </td>
                        </tr>
                      );
                    })
                : "No New Ticket created"}
            </tbody>
          </table>
        ) : (
          "No New Ticket created"
        )}
      </div>
      {filteredTickets.length > 0 && (
        <ul className="pagination">
          <li className={`page-item${currentPage === 0 ? " disabled" : ""}`}>
            <button
              className="page-link Hover"
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              aria-label="Previous page"
            >
              Previous
            </button>
          </li>
          {Array.from({ length: pageCount }, (_, i) => (
            <li key={i} className="page-item">
              <button
                className={`page-link Hover${
                  currentPage === i ? " active" : ""
                }`}
                type="button"
                onClick={() => setCurrentPage(i)}
                aria-label={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item${
              ticketsPerPage * (currentPage + 1) >= pageCount * 10
                ? " disabled"
                : ""
            }`}
          >
            <Link
              className="page-link Hover"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}
