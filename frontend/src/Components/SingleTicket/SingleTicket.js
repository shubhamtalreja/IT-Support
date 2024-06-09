import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useFetcher } from "react-router-dom";
import baseURL from "../../config/default.json";

import { useRef } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import "./singleTicket.css";
import CommentBox from "../CommentBox/CommentBox";
import TaskDetails from "../Task Details/TaskDetails";
import TicketDetails from "../TicketDetails/TicketDetails";
const SingleTicket = () => {
  const baseUrl = baseURL.baseUrl;
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const user = {
    email: jwt_decode(Cookies.get("token")).email,
    role: jwt_decode(Cookies.get("token")).role,
    employeeID: jwt_decode(Cookies.get("token")).employeeID,
    name: jwt_decode(Cookies.get("token")).name,
    userId: jwt_decode(Cookies.get("token")).userId,
  };

  const name = user.name;
  const email = user.email;

  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState();
  const [comment, setComment] = useState();
  const [assigneeData, setAssigneeData] = useState({});
  const [status, setStatus] = useState(" ");
  const [value, setValue] = useState();
  const [assignee, setAssignee] = useState([]);
  const [commentupdate, setCommentupdate] = useState(false);
  const [images, setImages] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [emails, setEmails] = useState();
  const [message, setMessage] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [itUserEmails, setItUserEmails] = useState([]);
  const [adminUserEmail, setadminuseremail] = useState([]);
  const [adminuserName, setadminuserName] = useState([]);
  const [statusmodal, setStatusmodal] = useState(false);
  const [statusSelected, setStatusSelected] = useState(false);
  const [assigneeSelected, setAssigneeSelected] = useState(false);
  const [assigneemodal, setAssigneemodal] = useState(false);
  const assingeeData =
    assignee.length > 0 ? assignee.map((item) => item.name) : [];
  const [assigneeArray, setAssigneeArray] = useState(assingeeData);
  const [commentUpdate, setCommentUpdate] = useState(false);

  const [selectedValue, setSelectedValue] = useState("");
  const defaultValue = "Select menu";
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  let selectedAssignee = "";
  let userEmail = [""];

  // ticket?.map((item) => {
  //   const assigneeName = assigneeArray[ticketId % assigneeArray.length];
  //   selectedAssignee = item.assignee?.name ? item.assignee?.name : assigneeName;
  // })
  ticket?.forEach((item) => {
    const assigneeName = assigneeArray[ticketId % assigneeArray.length];
    selectedAssignee = item.assignee?.name || assigneeName;
  });

  let reporter = "";
  let employeeId = "";
  const [formData, setFormData] = useState({
    ticketId,
    name,
    email,
    assignee: { name: "", employeeID: "" },
    status: "",
    comment: "",
    reporter: "",
    employeeId: "",
    emailList: [],
    itemailList: [],
    adminEmails: "",
    adminName: "",
    assigneeeName: selectedAssignee,
  });
  const prevStatus = useRef("");
  const prevAssignee = useRef({});
  const role = user.role;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  ticket?.map((item) => {
    reporter = item?.reporter?.name;
    employeeId = item.reporter?.employeeID;
  });

  const sendemailtouserandadmin = async (event) => {
    const bodyContent = JSON.stringify({
      ticketId: formData.ticketId,
      name: formData.name,
      email: formData.email,
      comment: formData.comment,
      reporter: ticket[0]?.ticketform?.reporter,
      assigneeeName: formData.assigneeeName,
    });
    if (role === "it") {
      try {
        const res = await fetch(`${baseUrl}/user/sendemailtouserandadmin`, {
          method: "POST",
          body: bodyContent,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const data = await res.json();
        if (data.status === 201) {
          setEmails("");
          setMessage(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  ticket?.map((item) => {
    prevStatus.current = item.status;
  });

  if (!Cookies.get("token")) {
    navigate("/");
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      reporter: reporter,
      employeeId: employeeId,
      emailList: userEmail,
      nameList: userName,
      itName: arrayofassigne,
      itemailList: itEmails,
      assigneeeName: selectedAssignee,
      adminEmails: adminEmails,
      adminName: adminName,
    });
    setValue(e.target.value);
  };

  const handleChangeAssignee = (e) => {
    let assignee_user =
      assignee.length > 0
        ? assignee.filter((user) => {
            return user.employeeID === e.target.value;
          })
        : [];

    prevAssignee.current = { ...assignee_user };

    setAssigneeData({
      ...assigneeData,
      assignee: {
        name: prevAssignee.current[0]?.name,
        employeeID: prevAssignee.current[0]?.employeeID,
      },
    });
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      reporter: reporter,
      emailList: userEmail,
      nameList: userName,
      itName: arrayofassigne,
      itemailList: itEmails,
      assigneeeName: selectedAssignee,
      adminEmails: adminEmails,
      adminName: adminName,
    });
    setAssigneeSelected(true);
  };

  const handleStatusChange = (e) => {
    if (e.target.value === "Select") {
      setStatusmodal(false);
      setStatus("");
      prevStatus.current = "";
      setFormData({ ...formData, status: "" });
      setStatusSelected(false);
    } else {
      setStatus(e.target.value);
      setSelectedValue(e.target.value);
      prevStatus.current = e.target.value;
      setFormData({
        ...formData,
        status: e.target.value,
        reporter: reporter,
        emailList: userEmail,
        nameList: userName,
        itName: arrayofassigne,
        itemailList: itEmails,
        assigneeeName: selectedAssignee,
        adminEmails: adminEmails,
        adminName: adminName,
      });
      setStatusSelected(true);
    }
  };
  useEffect(() => {
    const fetchTicket = async () => {
      if (submitClicked) {
        try {
          const res = await fetch(
            `${baseUrl}/ticket/singleticket?ticketId=${ticketId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          );

          const data = await res.json();

          setTicket(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchTicket();
  }, [submitClicked]);

  const handleSubmit = (event) => {
    setSubmitClicked(!submitClicked);
    if (prevStatus.current !== status && status !== "") {
      setStatusmodal(true);
    }

    updateTicket();
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const updateTicket = async () => {
    try {
      const res = await fetch(`${baseUrl}/ticket/update`, {
        method: "PUT",
        body: JSON.stringify({
          ticketId: formData.ticketId,
          status: formData.status,
          assignee: {
            name: formData.assignee.name,
            employeeID: formData.assignee.employeeID,
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      console.log(res, "Success");
    } catch (error) {
      console.log(error);
    }
  };
  const handleComment = async () => {
    try {
      setValue("");

      const bodyContent = JSON.stringify({
        employeeId: user.employeeID,
        ticketId: formData.ticketId,
        name: formData.name,
        comment: formData.comment,
      });

      const res = await fetch(
        `${baseUrl}/ticket/comment?ticketId=${ticketId}`,
        {
          method: "POST",
          body: bodyContent,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log(res, "Success");
      setCommentupdate(!commentupdate);
      // Fetch comment list after adding a comment
      fetchCommentListHandler();
      await updateTicket();
      await sendemailtoitanduser();
      await sendemailtouserandadmin();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const sendemailtoitanduser = async (event) => {
    if (role === "admin") {
      const bodyContent = JSON.stringify({
        assignee: formData.assignee,
        assigneeeName: formData.assigneeeName,
        comment: formData.comment,
        email: formData.email,
        name: formData.name,
        reporter: ticket[0]?.ticketform?.reporter,
        status: ticket[0]?.status,
        ticketId: formData.ticketId,
      });
      try {
        const res = await fetch(`${baseUrl}/user/sendemailtoitanduser`, {
          method: "POST",
          // body: JSON.stringify(formData),
          body: bodyContent,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const data = await res.json();
        if (data.status === 201) {
          setEmails("");
          setMessage(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBothClick = () => {
    if (
      status === "select" ||
      prevAssignee.current[0]?.name === selectedAssignee
    ) {
      setStatusSelected(false);
    } else if (prevStatus.current !== status && status !== "") {
      handleSubmit();
      sendemailtoitanduser();
      sendemailtouserandadmin();
    }
    if (assigneeSelected && statusSelected) {
      setStatusmodal(true);
    } else if (
      assigneeSelected &&
      prevAssignee.current[0]?.name !== selectedAssignee
    ) {
      setAssigneemodal(true);
    }
  };
  const handleClick = (e) => {
    setValue("");
  };
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/ticket/images?ticketId=${ticketId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, []);
  userEmail =
    userDetails.length > 0 ? userDetails.map((user) => user.email) : [];
  let userName =
    userDetails.length > 0 ? userDetails.map((user) => user.name) : [];
  useEffect(() => {
    if (
      prevAssignee.current[0]?.name !== "" &&
      prevAssignee.current[0]?.employeeID !== ""
    ) {
      setFormData({ ...formData, ...assigneeData });
    }
  }, [prevAssignee.current]);
  const fetchCommentListHandler = async () => {
    try {
      const commentResponse = await fetch(
        `${baseUrl}/ticket/comment/?ticketId=${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (!commentResponse.ok) {
        // Handle error 
        console.error("Failed to fetch comments");
      } else {
        const commentData = await commentResponse.json();
        setComment(commentData);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    fetchCommentListHandler();
  }, []);
  const fetchData = async () => {
    try {
      const ticketResponse = await fetch(
        `${baseUrl}/ticket/singleticket?ticketId=${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const ticketData = await ticketResponse.json();
      setTicket(ticketData);

      const assigneeResponse = await fetch(`${baseUrl}/user/itmember`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const assigneeData = await assigneeResponse.json();
      setAssignee(assigneeData);
    } catch (err) {
      console.log(err);
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;

  const currentComments =
    comment && comment[0] && comment[0].comments
      ? comment[0].comments.slice(indexOfFirstComment, indexOfLastComment)
      : [];

  const totalPages =
    comment && comment[0] && comment[0].comments
      ? Math.ceil(comment[0]?.comments?.length / commentsPerPage)
      : [];
  useEffect(() => {
    fetchData();
  }, [commentupdate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/user/userDetails`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  const handleClosemodal = () => {
    setStatusmodal(false);
    setSubmitClicked(true);
    setAssigneemodal(false);
  };
  useEffect(() => {
    const updatedAssigneeData =
      assignee.length > 0 ? assignee.map((item) => item.name) : [];
    setAssigneeArray(updatedAssigneeData);
  }, [assignee]);
  let arrayofassigne =
    assigneeArray.length > 0 ? assigneeArray.map((item) => item) : [];

  useEffect(() => {
    const adminUsers = users.filter((user) => user.role === "admin");
    const adminuserEmail = adminUsers.map((user) => user.email);
    setadminuseremail(adminuserEmail);
    const adminuserName = adminUsers.map((user) => user.name);
    setadminuserName(adminuserName);
    const itUsers = users.filter((user) => user.role === "it");
    const itUserEmails = itUsers.map((user) => user.email);
    setItUserEmails(itUserEmails);
  }, [users]);

  let adminEmails = adminUserEmail.map((item) => item);
  let adminName = adminuserName.map((item) => item);
  let itEmails = itUserEmails.map((item) => item);

  useEffect(() => {
    const viewImageBtn = document.getElementById("view-image-btn");
    if (viewImageBtn && viewImageBtn.hasAttribute("disabled")) {
      viewImageBtn.removeAttribute("data-bs-toggle");
      viewImageBtn.removeAttribute("data-bs-target");
    }
  }, [ticket]);

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `${baseUrl}/ticket/deleteComment?ticketId=${ticketId}&commentId=${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      // Handle the response as needed
      if (res.ok) {
        // Handle success
        console.log("Comment deleted successfully");
        setCommentUpdate((prev) => !prev);
        fetchCommentListHandler();
      } else {
        // Handle error
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wrapperDiv ticketIdPage">
      <div className="container-fluid">
        <div className="Heading ">WT:{ticketId}</div>

        <div className="inner-page mt-20">
          <div className="row">
            {/* ========== leftside =========== */}
            <div className="col-lg-9 col-sm-12">
              <div className="leftside">
                <div className="detailcontainer">
                  {ticket?.map((item, index = 0) => (
                    <TicketDetails
                      key={index + 1}
                      item={item}
                      images={item.images}
                    />
                  ))}
                </div>
                {currentComments ? (
                  <CommentBox
                    currentComments={currentComments}
                    handleChange={handleChange}
                    value={value}
                    handleComment={handleComment}
                    handleClick={handleClick}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    role={role}
                    ticketId={ticketId}
                    deleteCommentHandler={deleteComment}
                    commentUpdate={commentUpdate}
                    setCommentUpdate={setCommentUpdate}
                  />
                ) : (
                  <CommentBox
                    handleChange={handleChange}
                    value={value}
                    handleComment={handleComment}
                    handleClick={handleClick}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    role={role}
                    ticketId={ticketId}
                    deleteComment={deleteComment}
                  />
                )}
              </div>
            </div>
          </div>
          {/* user right side for ADD USER start */}
          <div id="rightside" className="rightside">
            {ticket?.map((item, index) => (
              <TaskDetails
                ticket={ticket}
                item={item}
                ticketId={ticketId}
                assigneeArray={assigneeArray}
                // assigneeName={assigneeName}
                handleChangeAssignee={handleChangeAssignee}
                assignee={assignee}
                defaultValue={defaultValue}
                handleStatusChange={handleStatusChange}
                selectedValue={selectedValue}
                handleBothClick={handleBothClick}
                statusSelected={statusSelected}
                assigneeSelected={assigneeSelected}
                selectedAssignee={selectedAssignee}
                
              />
            ))}
          </div>
          {/* user right side for ADD USER end */}
          {assigneeSelected && !statusSelected ? (
            <div
              className={assigneemodal ? "modal successModal open" : "modal"}
            >
              <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
              <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Assignee</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => handleClosemodal()}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p className="mb-0">
                      <i className="fa-sharp fa-regular fa-circle-check"></i>{" "}
                      &nbsp;Assignee is changed to {assigneeData.assignee?.name}
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={() => handleClosemodal()}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !assigneeSelected && statusSelected ? (
            <div
              className={statusmodal ? "modal  successModal  open" : "modal"}
            >
              <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
              <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Status</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => handleClosemodal()}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p className="mb-0">
                      <i className="fa-sharp fa-regular fa-circle-check"></i>{" "}
                      &nbsp;Status is changed to {status}.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={() => handleClosemodal()}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : assigneeSelected && statusSelected ? (
            <div className={statusmodal ? "modal successModal open" : "modal"}>
              <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
              <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Status</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => handleClosemodal()}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="modal-content">
                      <p className="mb-0">
                        <i className="fa-sharp fa-regular fa-circle-check"></i>{" "}
                        &nbsp;Status is changed to {status}.
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => handleClosemodal()}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SingleTicket;
