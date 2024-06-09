import { useState } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useDebounce from "../lib/hooks/useDebounce";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";
export default function CustomTable({
  tickets,
  columns,
  exportTicketDataInExcel,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const ticketsPerPage = 10;
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState({
    createdOn: "asc",
    updatedOn: "asc",
    priority: "asc",
    status: "asc",
  });
  const [column, setColumn] = useState("");
  if (!Cookies.get("token")) {
    navigate("/");
  }

  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken.role;
  const role = user;
  const location = useLocation();

  const isAllTicketComponent =
    location.pathname.includes("/admin/dashboard/allticket") ||
    location.pathname.includes("/it/dashboard/AllTicketforIt");

  const handleView = (ticketId) => {
    if (role === "admin") {
      navigate(`/admin/dashboard/allticket/ticketId/WT${ticketId}`);
    } else if (role === "it") {
      navigate(`/it/dashboard/ticketId/WT${ticketId}`);
    } else {
      navigate(`/user/dashboard/previousticket/ticketId/WT${ticketId}`);
    }
  };
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
  const pageCountadmin = Math.ceil(tickets.length / ticketsPerPage);
  const pageCountit = Math.ceil(tickets.length / ticketsPerPage);
  const filteredTickets = tickets.filter(applySearchFilter);
  const pageCount = Math.ceil(filteredTickets.length / ticketsPerPage);
  const startIndex = currentPage * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  // const headersUser = [
  //   { label: "S.no" },
  //   { label: "Ticket No" },
  //   { label: "Title" },
  //   { label: "Description" },
  //   {
  //     label: "Created On",
  //     onClick: () => handleSort("createdOn"),
  //   },
  //   ...(role !== "user"
  //     ? [
  //         { label: "Reporter" },

  //         {
  //           label: "Updated On",
  //           onClick: () => handleSort("updatedOn"),
  //         },
  //       ]
  //     : []),
  //   {
  //     label: "Priority",
  //     onClick: () => handleSort("priority"),
  //   },
  //   {
  //     label: "Status",
  //     onClick: () => handleSort("status"),
  //   },
  // ];

  // const headers =
  //   role === "user" || role === "it" || role === "admin"
  //     ? headersUser
  //     : headersUser;

  return (
    <>
      <div className="table-responsive">
        <div className="input-group mb-3">
          {/* {role === "admin" || role === "it" ? (
            <div className="dropdown col-md-3">
              <div className="d-grid ">
                <button
                  className="btn btn-outline-secondary"
                  id="dropdownMenuLink"
                  aria-expanded="false"
                  onClick={exportTicketDataInExcel}
                >
                  Export Ticket Data
                </button>
              </div>
            </div>
          ) : (
            ""
          )} */}
          {isAllTicketComponent && (
            <div className="dropdown col-md-3">
              <div className="d-grid ">
                <button
                  className="btn btn-outline-secondary"
                  id="dropdownMenuLink"
                  aria-expanded="false"
                  onClick={exportTicketDataInExcel}
                >
                  Export Ticket Data
                </button>
              </div>
            </div>
          )}
          <div className="searchInputDiv ms-2">
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
                {/* {headers.map((header, index) => (
                  <th
                    key={index}
                 //   style={{ color: "black" }}
                    onClick={header.onClick}
                  >
                    {header.label}
                    {header.onClick && renderSortArrow(header.column)}
                  </th>
                ))} */}
                {columns.map((header, index) => (
                  <th key={index} onClick={() => handleSort(header.column)}>
                    {header.label}
                    {header.column && renderSortArrow(header.column)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredTickets !== undefined &&
              Array.isArray(filteredTickets) &&
              filteredTickets.length > 0 ? (
                filteredTickets
                  .slice(startIndex, endIndex)
                  .sort((a, b) => {
                    switch (column) {
                      case "createdOn":
                        return compareDates(a.created_on, b.created_on, column);
                      case "updatedOn":
                        return compareDates(a.updated_on, b.updated_on, column);
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
                        onClick={() => handleView(ticket.ticketId)}
                      >
                        <td className="view-column" style={{ width: "2px" }}>
                          {sNo}
                        </td>
                        <td className="view-column" style={{ width: "90px" }}>
                          {"WT-"}
                          {ticket.ticketId}
                        </td>
                        <td
                          className="view-column__title"
                          style={{ width: "200px" }}
                        >
                          {ticket.ticketform?.title
                            ? ticket.ticketform?.title
                            : "-"}
                        </td>
                        <td
                          className="view-column"
                          style={{ width: "300px" }}
                          data-bs-toggle="tooltip"
                          // data-bs-placement="top"
                          title={ticket.ticketform?.description}
                        >
                          {ticket?.ticketform && ticket.ticketform?.description
                            ? ticket.ticketform?.description?.slice(0, 80) + ""
                            : "-"}
                        </td>
                        <td className="view-column">
                          {ticket.created_on.date} , {ticket.created_on.time}
                        </td>
                        {role !== "user" && (
                          <>
                            <td
                              className="view-column"
                              style={{ width: "100px" }}
                            >
                              {ticket?.ticketform && ticket.ticketform?.reporter
                                ? ticket.ticketform?.reporter
                                : "-"}
                            </td>

                            <td className="view-column">
                              {ticket.updated_on?.date} ,{" "}
                              {ticket.updated_on?.time}
                            </td>
                          </>
                        )}

                        <td className="view-column">
                          {ticket.ticketform?.priority
                            ? ticket.ticketform?.priority
                            : "-"}
                        </td>
                        <td className="view-column">
                          {ticket?.status ? ticket?.status : "-"}
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="8">No Tickets found</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          "No Tickets found"
        )}
      </div>
      {filteredTickets.length > 0 && (
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item${currentPage === 0 ? " disabled" : ""}`}>
              <Link
                className="page-link Hover"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Link>
            </li>
            {[
              ...Array(role === "it" ? pageCountit : pageCountadmin).keys(),
            ].map((page) => (
              <li key={page} className="page-item">
                <Link
                  className={`page-link Hover${
                    currentPage === page ? " active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page + 1}
                </Link>
              </li>
            ))}
            <li
              className={`page-item${
                ticketsPerPage * (currentPage + 1) >=
                (role === "it" ? pageCountit : pageCountadmin) * 10
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
        </nav>
      )}
    </>
  );
}
