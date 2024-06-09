import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import baseURL from "../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Chart, registerables } from "chart.js";
import ResolvedTicket from "../AllTicket/AllTicket";
import CommentListforIt from "./CommentListforIt";
import OpenTicket from "../OpenTicket/OpenTicket";
import CloseTicket from "../CloseTicket/CloseTicket";
import InprogressTicket from "../InprogressTicket/InprogressTicket";
import AllTicketsforIt from "../AllTicketsforIt/AllTicketforIt";
import AllUser from "../AdminDashboard/AllUser/AllUser";

Chart.register(...registerables);

const Dashboard3 = () => {
  const baseUrl = baseURL.baseUrl;
  const [ticketscount, setTicketscount] = useState();
  const [AllUserIt, setAlluserIt] = useState();
  const [AllUserStatusOpen, setAlluserStatusOpen] = useState();
  const [AllUserStatusClose, setAlluserStatusClose] = useState();
  const [AllUserStatusResolve, setAlluserStatusResolve] = useState();
  const [AllUserStatusInprogress, setAlluserStatusInprogress] = useState();
  const [commentsforItandAdmin, setCommentsforItandAdmin] = useState();
  const [totalCommentCount, settotalCommentCount] = useState();
  const [counts, setCounts] = useState();
  const [userCountIt, setUserCountIt] = useState();
  const [userCountOpen, setUserCountOpen] = useState();
  const [UserCountClose, setCountClose] = useState();
  const [UserCountResolve, setUserCountResolve] = useState();
  const [UserCountInprogress, setUserCountInprogress] = useState();
  const [showAllComments, setShowAllComments] = useState(false);
  const [TotalCommentCount, setTotalCommentCount] = useState(false);
  const [showCommentCount, setShowCommentCount] = useState(false);
  const [showOpenTickets, setshowOpenTickets] = useState(false);
  const [showClosedTickets, setshowClosedTickets] = useState(false);
  const [showResolveTickets, setshowResolveTickets] = useState(false);
  const [showInprogressTickets, setshowInprogressTickets] = useState(false);
  const [showAllTicketsforIt, setShowAllTicketsforIt] = useState(false);
  const [showAlluser, setShowAlluser] = useState(false);

  const user = {
    email: jwt_decode(Cookies.get("token")).email,
    role: jwt_decode(Cookies.get("token")).role,
    employeeID: jwt_decode(Cookies.get("token")).employeeID,
    name: jwt_decode(Cookies.get("token")).name,
    userId: jwt_decode(Cookies.get("token")).userId,
    password: jwt_decode(Cookies.get("token")).Password,
  };

  const handleToggleTotalComments = () => {
    setShowCommentCount(!showCommentCount);
  };
  const handleToggletOpenTickets = () => {
    setshowOpenTickets(!showOpenTickets);
  };
  const handleToggletCloseTickets = () => {
    setshowClosedTickets(!showClosedTickets);
  };
  const handleToggletResolveTickets = () => {
    setshowResolveTickets(!showResolveTickets);
  };
  const handleToggletInprogressTickets = () => {
    setshowInprogressTickets(!showInprogressTickets);
  };
  const handleToggleAllTicketsforIt = () => {
    setShowAllTicketsforIt(!showAllTicketsforIt);
  };
  const handleShowAllUser = () => {
    setShowAlluser(!showAlluser);
  };
  const TicketGraph = ({
    counts,
    userCountIt,
    userCountOpen,
    UserCountClose,
    UserCountResolve,
    UserCountInprogress,
    TotalCommentCount,
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
              "Total It members",
              "Open Tickets",
              "Close Tickets",
              "Resolve Tickets",
              "In progress Tickets",
              "Total Comment",
            ],
            datasets: [
              {
                label: "Ticket Counts",
                data: [
                  counts,
                  userCountIt,
                  userCountOpen,
                  UserCountClose,
                  UserCountResolve,
                  UserCountInprogress,
                  TotalCommentCount,
                ],
                backgroundColor: [
                  "#0073b6",
                  "#dd4c39",
                  "#6c757d",
                  "#f49d12",
                  "#f9d005",
                  "#03a859",
                  "black",
                ],
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
    }, [
      counts,
      userCountIt,
      userCountOpen,
      UserCountClose,
      UserCountResolve,
      UserCountInprogress,
    ]);

    return (
      <div className="Bar-graph">
        <canvas ref={chartRef}></canvas>
      </div>
    );
  };
  const TicketGraphPie = ({
    counts,
    userCountIt,
    userCountOpen,
    UserCountClose,
    UserCountResolve,
    UserCountInprogress,
    TotalCommentCount,
    handleToggleResolvedTickets,
    handleToggleCloseTickets,
    handleToggleTotalCommentshandleToggletOpenTickets,
    handleToggletCloseTickets,
    handleToggletResolveTickets,
    handleToggletInprogressTickets,
    handleToggleAllTicketsforIt,
    handleShowAllUser,
  }) => {
    const chartRef = useRef(null);

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");

        new Chart(ctx, {
          type: "pie",
          data: {
            labels: [
              "Total Tickets",
              "Total It members",
              "Open Tickets",
              "Close Tickets",
              "Resolve Tickets",
              "In progress Tickets",
              "Total Comments Count",
            ],
            datasets: [
              {
                label: "Ticket Counts",
                data: [
                  counts,
                  userCountIt,
                  userCountOpen,
                  UserCountClose,
                  UserCountResolve,
                  UserCountInprogress,
                  TotalCommentCount,
                ],
                backgroundColor: [
                  "#0073b6",
                  "#dd4c39",
                  "#6c757d",
                  "#f49d12",
                  "#f9d005",
                  "#03a859",
                  "black",
                ],
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
                if (clickedElementIndex === 6) {
                  handleToggleTotalComments();
                }
                if (clickedElementIndex === 2) {
                  handleToggletOpenTickets();
                }
                if (clickedElementIndex === 3) {
                  handleToggletCloseTickets();
                }
                if (clickedElementIndex === 4) {
                  handleToggletResolveTickets();
                }
                if (clickedElementIndex === 5) {
                  handleToggletInprogressTickets();
                }
                if (clickedElementIndex === 0) {
                  handleToggleAllTicketsforIt();
                }
                if (clickedElementIndex === 1) {
                  handleShowAllUser();
                }
              }
            },
          },
        });
      }
    }, [
      counts,
      userCountIt,
      userCountOpen,
      UserCountClose,
      UserCountResolve,
      UserCountInprogress,
    ]);

    return (
      <div className="Pie-graph">
        <canvas
          ref={chartRef}
          style={{ height: "100%", width: "100%" }}
        ></canvas>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/ticket/ticketcount`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
      
        setTicketscount(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData1 = async () => {
      try {
        const response = await fetch(`${baseUrl}/user/itmemberCount`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        setAlluserIt(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData2 = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/ticket/ticketcountOnstatusOpen`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await response.json();
       
        setAlluserStatusOpen(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData3 = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/ticket/ticketcountOnstatusClose`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await response.json();
        setAlluserStatusClose(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData4 = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/ticket/ticketcountOnstatusResolve`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await response.json();
        setAlluserStatusResolve(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData5 = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/ticket/ticketcountOnstatusInprogress`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await response.json();
        setAlluserStatusInprogress(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData6 = async () => {
      try {
        const response = await fetch(`${baseUrl}/ticket/commentforItandAdmin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        setCommentsforItandAdmin(data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchData7 = async () => {
      try {
        const response = await fetch(`${baseUrl}/ticket/TotalComments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        settotalCommentCount(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    fetchData1();
    fetchData2();
    fetchData3();
    fetchData4();
    fetchData5();
    fetchData6();
    fetchData7();
  }, []);

  useEffect(() => {
    if (ticketscount) {
      setCounts(ticketscount.count);
    }
    if (AllUserIt) {
      setUserCountIt(AllUserIt.count);
    }
    if (AllUserStatusOpen) {
      setUserCountOpen(AllUserStatusOpen.count);
    }
    if (AllUserStatusClose) {
      setCountClose(AllUserStatusClose.count);
    }
    if (AllUserStatusResolve) {
      setUserCountResolve(AllUserStatusResolve.count);
    }
    if (AllUserStatusInprogress) {
      setUserCountInprogress(AllUserStatusInprogress.count);
    }
    if (commentsforItandAdmin) {
      setShowAllComments(commentsforItandAdmin.commentData);
    }
    if (totalCommentCount) {
      setTotalCommentCount(totalCommentCount.totalCount);
    }
  }, [
    ticketscount,
    AllUserIt,
    AllUserStatusOpen,
    AllUserStatusClose,
    AllUserStatusResolve,
    AllUserStatusInprogress,
    commentsforItandAdmin,
    totalCommentCount,
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
                      to="/it/dashboard/AllTicketforIt"
                      style={{ cursor: "pointer" }}
                    >
                      Total Tickets
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco daprBg">
                      <i className="fas fa-users"></i>
                    </div>
                    <p className="numCount">{userCountIt}</p>
                    <Link
                      className="numText"
                      to="/it/dashboard/alluser"
                      style={{ cursor: "pointer" }}
                    >
                      Total It members
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco opnTicBg">
                      <i className="fa-solid fa-address-card"></i>
                    </div>
                    <p className="numCount">{userCountOpen}</p>
                    <Link
                      className="numText"
                      to="/it/dashboard/OpenTicket"
                      style={{ cursor: "pointer" }}
                    >
                      Open Tickets
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco smBg">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <p className="numCount">{UserCountClose}</p>
                    <Link className="numText" to="/it/dashboard/CloseTicket">
                      Close Tickets
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco rsolveTicBg">
                      <i className="fa fa-check-double"></i>
                    </div>
                    <p className="numCount">{UserCountResolve}</p>
                    <Link className="numText" to="/it/dashboard/ResolveTicket">
                      Resolve Tickets
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco feedBg">
                      <i className="fa fa-tasks-alt"></i>
                    </div>
                    <p className="numCount">{UserCountInprogress}</p>
                    <Link
                      className="numText"
                      to="/it/dashboard/InprogressTicket"
                    >
                      In progress Tickets
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-15">
                  <div className="fourTiles">
                    <div className="leftIco feedComments">
                      <i className="far fa-comments"></i>
                    </div>
                    <p className="numCount">{TotalCommentCount}</p>
                    <Link
                      className="numText"
                      to="/it/dashboard/CommentListforIt"
                    >
                      All Comments For It
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Statistic */}
          <div className="graphDiv">
            <div className="container">
              <h2 className="Heading">Ticket Statistics</h2>
              <div className="row Graphchart">
                <div className="col-md-12 col-lg-6">
                  <div className="ticketsGraph">
                    <TicketGraph
                      counts={counts}
                      userCountIt={userCountIt}
                      userCountOpen={userCountOpen}
                      UserCountClose={UserCountClose}
                      UserCountResolve={UserCountResolve}
                      UserCountInprogress={UserCountInprogress}
                      TotalCommentCount={TotalCommentCount}
                    />
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="ticketsGraphPie">
                    <TicketGraphPie
                      counts={counts}
                      userCountIt={userCountIt}
                      userCountOpen={userCountOpen}
                      UserCountClose={UserCountClose}
                      UserCountResolve={UserCountResolve}
                      UserCountInprogress={UserCountInprogress}
                      TotalCommentCount={TotalCommentCount}
                      handleToggleTotalComments={handleToggleTotalComments}
                      handleToggletOpenTickets={handleToggletOpenTickets}
                      handleToggletCloseTickets={handleToggletCloseTickets}
                      handleToggletResolveTickets={handleToggletResolveTickets}
                      handleToggletInprogressTickets={
                        handleToggletInprogressTickets
                      }
                      handleToggleAllTicketsforIt={handleToggleAllTicketsforIt}
                      handleShowAllUser={handleShowAllUser}
                    />
                  </div>
                </div>
              </div>
              {showCommentCount && (
                <div className="Total-Cooment">
                  <CommentListforIt />
                </div>
              )}
              {showOpenTickets && (
                <div className="Open-Ticket">
                  <OpenTicket />
                </div>
              )}
              {showClosedTickets && (
                <div className="Close-Ticket">
                  <CloseTicket />
                </div>
              )}
              {showResolveTickets && (
                <div className="Resolve-Ticket">
                  <ResolvedTicket />
                </div>
              )}
              {showInprogressTickets && (
                <div className="Inprogress-Ticket">
                  <InprogressTicket />
                </div>
              )}
              {showAllTicketsforIt && (
                <div className="AllTicketsforit">
                  <AllTicketsforIt />
                </div>
              )}
              {showAlluser && (
                <div className="AllTicketsforit">
                  <AllUser />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard3;
