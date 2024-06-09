import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import baseURL from "../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Chart, registerables } from "chart.js";
import PreviousTicket from "./PreviousTicket/PreviousTicket";
import Homepage from "./Homepage/Homepage";
import CommentList from "./CommentListContainer";
import Allticketuser from "./allTicketUser/allTicketUser";

Chart.register(...registerables);

const Dashboard = () => {
  const baseUrl = baseURL.baseUrl;
  const [ticketscount, setTicketscount] = useState();
  const [ticketscountstatus, setTicketscountstatus] = useState();
  const [ticketscountstatusnotResolve, setTicketscountstatusnotResolve] =
    useState();
  const [totalComment, setTotalComment] = useState();
  const [gettotalCommentData, setTotalCommentData] = useState();
  const [counts, setCounts] = useState();
  const [countsStatus, setCountsStatus] = useState();
  const [countsStatusNotResolve, setCountsStatusNotResolve] = useState();
  const [commentCount, setCommentCount] = useState();
  const [commentData, setcommentData] = useState();
  const user = {
    email: jwt_decode(Cookies.get("token")).email,
    role: jwt_decode(Cookies.get("token")).role,
    employeeID: jwt_decode(Cookies.get("token")).employeeID,
    name: jwt_decode(Cookies.get("token")).name,
    userId: jwt_decode(Cookies.get("token")).userId,
    password: jwt_decode(Cookies.get("token")).Password,
  };
  let employeeId = user.employeeID;
  const [showResolvedTickets, setShowResolvedTickets] = useState(false);
  const [showUnResolvedTickets, setShowUnResolvedTickets] = useState(false);
  const [ShowAllComments, setShowAllComments] = useState(false);
  const [Allticketforuser, setAllticketforuser] = useState(false);

  const handleToggleResolvedTickets = () => {
    setShowResolvedTickets(!showResolvedTickets);
  };
  const handleToggleUnResolvedTickets = () => {
    setShowUnResolvedTickets(!showUnResolvedTickets);
  };
  const handleShowAllComments = () => {
    setShowAllComments(!ShowAllComments);
  };
  const handleShowAllTicket = () => {
    setAllticketforuser(!Allticketforuser);
  };

  const TicketGraph = ({
    counts,
    countsStatus,
    countsStatusNotResolve,
    commentCount,
  }) => {
    const chartRef = useRef(null);

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              "Total Tickets",
              "Resolved Tickets",
              "Tickets In Process",
              "Total Comments",
            ],
            datasets: [
              {
                label: "Ticket Counts",
                data: [
                  counts,
                  countsStatus,
                  countsStatusNotResolve,
                  commentCount,
                ],
                backgroundColor: ["#0073b6", "#f9d005", "#f49d12", "#03a859"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                precision: 0,
              },
            },
            indexAxis: "x",
            barThickness: 60,
          },
        });
      }
    }, [counts, countsStatus, countsStatusNotResolve, commentCount]);

    return (
      <div className="Bar-graph">
        <canvas ref={chartRef}></canvas>
      </div>
    );
  };
  const TicketGraphPie = ({
    counts,
    countsStatus,
    countsStatusNotResolve,
    commentCount,
    handleToggleResolvedTickets,
    handleToggleUnResolvedTickets,
    handleShowAllComments,
    handleShowAllTicket,
  }) => {
    const chartRef = useRef(null);

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");

        new Chart(ctx, {
          type: "pie",
          data: {
            labels: [
              " Total Tickets",
              "Resolved Tickets",
              "Tickets In Process",
              "Total Comments",
            ],
            datasets: [
              {
                label: "Ticket Counts",
                data: [
                  counts,
                  countsStatus,
                  countsStatusNotResolve,
                  commentCount,
                ],
                backgroundColor: ["#0073b6", "#f9d005", "#f49d12", "#03a859"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                precision: 0,
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || "";
                    const value = context.parsed;
                    const total = context.chart.data.datasets[0].data.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = ((value / total) * 100).toFixed(2) + "%";
                    return label + ": " + value + " (" + percentage + ")";
                  },
                },
              },
            },
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const clickedElementIndex = elements[0].index;
                if (clickedElementIndex === 1) {
                  handleToggleResolvedTickets();
                }
                if (clickedElementIndex === 2) {
                  handleToggleUnResolvedTickets();
                }
                if (clickedElementIndex === 3) {
                  handleShowAllComments();
                }
                if (clickedElementIndex === 0) {
                  handleShowAllTicket();
                }
              }
            },
          },
        });
        chartRef.current.onclick = null;
      }
    }, [counts, countsStatus, countsStatusNotResolve, commentCount]);
    return (
      <div className="Pie-graph">
        <canvas ref={chartRef}></canvas>
      </div>
    );
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/ticket/ticketcountOnEmployeeID?employeeId=${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
    
      setTicketscount(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchData1 = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/ticket/userTicketCountOnBasisOfResolve?employeeId=${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
   
      setTicketscountstatus(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/ticket/ticketcountOnstatusnotResolve?employeeId=${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
  
      setTicketscountstatusnotResolve(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData3 = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/ticket/totalcommentBasedonEmployeeId?employeeId=${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      setTotalComment(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData4 = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/ticket/datacommentBasedonEmployeeId?employeeId=${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      setTotalCommentData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
    fetchData1();
    fetchData2();
    fetchData3();
    fetchData4();
  }, []);

  useEffect(() => {
    if (ticketscount) {
      setCounts(ticketscount.count);
    }
    if (ticketscountstatus) {
      setCountsStatus(ticketscountstatus.count);
    }
    if (ticketscountstatusnotResolve) {
      setCountsStatusNotResolve(ticketscountstatusnotResolve.count);
    }
    if (totalComment) {
      setCommentCount(totalComment.totalSum);
    }
    if (gettotalCommentData) {
      setcommentData(gettotalCommentData.commentData);
    }
  }, [
    ticketscount,
    ticketscountstatus,
    ticketscountstatusnotResolve,
    totalComment,
    gettotalCommentData,
  ]);
  return (
    <>
      <div className="wrapperDiv">
        <div className="">
          <div className="tielsRow ">
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco ticBg">
                      <i className="fa fa-ticket-alt"></i>
                    </div>
                    <p className="numCount">{counts}</p>
                    <Link
                      className="numText"
                      to="/user/dashboard/allTicketUser"
                      style={{ cursor: "pointer" }}
                    >
                      Total Tickets
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco rsolveTicBg">
                      <i className="fa fa-check-double"></i>
                    </div>
                    <p className="numCount">{countsStatus}</p>
                    <Link
                      className="numText"
                      to="/user/dashboard/previousticket"
                      style={{ cursor: "pointer" }}
                    >
                      Resolved Tickets
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco smBg">
                      <i className="fa fa-tasks-alt"></i>
                    </div>
                    <p className="numCount">{countsStatusNotResolve}</p>
                    <Link className="numText" to="/user/dashboard/Homepage">
                      Tickets In Process
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco ttlComtBg">
                      <i className="far fa-comments"></i>
                    </div>
                    <p className="numCount">{commentCount}</p>
                    <Link
                      className="numText"
                      to="/user/dashboard/CommentListContainer"
                    >
                      Total comments on Tickets
                    </Link>
                  </div>
                </div>
              </div>

              {/* Ticket Statistic */}
              <div className="graphDiv">
                <h2 className="Heading mobHeading">Ticket Statistics</h2>
                <div className="row Graphchart">
                  <div className="col-md-12 col-lg-6">
                    <div className="ticketsGraph">
                      <TicketGraph
                        counts={counts}
                        countsStatus={countsStatus}
                        countsStatusNotResolve={countsStatusNotResolve}
                        commentCount={commentCount}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-6">
                    <div className="ticketsGraphPie">
                      <TicketGraphPie
                        counts={counts}
                        countsStatus={countsStatus}
                        countsStatusNotResolve={countsStatusNotResolve}
                        commentCount={commentCount}
                        handleToggleResolvedTickets={
                          handleToggleResolvedTickets
                        }
                        handleToggleUnResolvedTickets={
                          handleToggleUnResolvedTickets
                        }
                        handleShowAllComments={handleShowAllComments}
                        handleShowAllTicket={handleShowAllTicket}
                      />
                    </div>
                  </div>
                </div>
                {showResolvedTickets && (
                  <div className="resolvedTickets">
                    <PreviousTicket />
                  </div>
                )}
                {showUnResolvedTickets && (
                  <div className="Tickets In Process">
                    <Homepage />
                  </div>
                )}
                {ShowAllComments && (
                  <div className="Comments">
                    <CommentList />
                  </div>
                )}
                {Allticketforuser && (
                  <div className="allTicket">
                    <Allticketuser />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
