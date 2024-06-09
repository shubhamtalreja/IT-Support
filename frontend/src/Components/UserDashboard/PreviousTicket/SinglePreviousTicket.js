import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import baseURL from "../../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import "./singlePreviousTicket.css";
import CommentBox from "../../CommentBox/CommentBox";
import TaskDetails from "../../Task Details/TaskDetails";
import TicketDetails from "../../TicketDetails/TicketDetails";

const SinglePreviousTicket = () => {
  const user = {
    email: jwt_decode(Cookies.get("token")).email,
    role: jwt_decode(Cookies.get("token")).role,
    employeeID: jwt_decode(Cookies.get("token")).employeeID,
    name: jwt_decode(Cookies.get("token")).name,
    userId: jwt_decode(Cookies.get("token")).userId,
    password: jwt_decode(Cookies.get("token")).Password,
  };
  let employeeId = user.employeeID;
  const baseUrl = baseURL.baseUrl;
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState();
  const [comment, setComment] = useState();
  const [ticketCommentData, setTicketCommentData] = useState([]);
  const [formData, setFormData] = useState({ ticketId, employeeId });
  const [value, setValue] = useState();
  const [commentupdate, setCommentupdate] = useState(false);
  const [images, setImages] = useState([]);
  const [assignee, setAssignee] = useState([]);
  // const [pdfopen, setpdfOpen] = useState(false);
  // const [imageopen, setImageOpen] = useState(false);
  const [formsData, setformsData] = useState(user);
  const [users, setUsers] = useState([]);
  const [ItUserEmails, setItUserEmails] = useState([]);
  const [adminuseremail, setadminuseremail] = useState([]);
  const [email, setEmail] = useState();
  const [message, setMessage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      employeeId: employeeId,
    });
    let value = e.target.value;
    setformsData({
      ...formsData,
      [e.target.name]: e.target.value.charAt(0).toUpperCase() + value.slice(1),
      itEmails: itEmails,
      adminemail: adminemail,
      ticketId: ticketId,
    });
    setValue(e.target.value);
  };
  const name = formsData.name;

  // const handlepdfLink = (index) => {
  //   setpdfOpen(index);
  // };
  // const handleImageLink = (index) => {
  //   setImageOpen(index);
  // };
  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUrl}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();

      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (e) => {
    setValue("");
  };

  const sendEmailToAdminItAboutComment = async (event) => {
    const bodyContent = JSON.stringify({
      email: formsData.email,
      role: formsData.role,
      employeeID: formsData.employeeID,
      name: formsData.name,
      comment: formsData.comment,
      ticketId: formsData.ticketId,
    });
    try {
      const response = await fetch(
        `${baseUrl}/user/commentdetailToAdminandIt`,
        {
          method: "POST",
          body: bodyContent,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 201) {
        setEmail("");
        setMessage(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setValue("");
  //   try {
  //     const response = await fetch(`${baseUrl}/ticket/comment`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         ...formsData,
  //         name: formsData.name,
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${Cookies.get("token")}`,
  //       },
  //     });
  //
  //     // console.log("Success ");
  //     setCommentupdate(!commentupdate);
  //     sendEmailToAdminItAboutComment();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleComment = async (e) => {
    e.preventDefault();
    setValue("");

    try {
      const ticketData = await fetch(
        `${baseUrl}/ticket/singleticket?ticketId=${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const ticketDetails = await ticketData.json();

      const bodyContent = JSON.stringify({
        employeeId: formsData.employeeID,
        ticketId: formsData.ticketId,
        name: formsData.name,
        comment: formsData.comment,
      });
      const response = await fetch(`${baseUrl}/ticket/comment`, {
        method: "POST",
        body: bodyContent,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const responseData = await response.json();
      console.log(responseData);

      setCommentupdate(!commentupdate);
      sendEmailToAdminItAboutComment();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const itUsers = users.filter((user) => user.role === "it");
    const itUserEmails = itUsers.map((user) => user.email);
    setItUserEmails(itUserEmails);
    const adminUsers = users.filter((user) => user.role === "admin");
    const adminuserEmail = adminUsers.map((user) => user.email);
    setadminuseremail(adminuserEmail);
  }, [users]);
  let itEmails = ItUserEmails.map((item) => item);
  let adminemail = adminuseremail.map((item) => item);
  const fetchTicketImageData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/ticket/images?ticketId=${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();

      setImages(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTicketImageData();
  }, []);
  const fetchItMemberData = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/itmember`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();

      setAssignee(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchItMemberData();
  }, []);

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
    const fetchSingleTicket = async () => {
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
        setFormData({ ...formData, name: data[0].reporter?.name });
      } catch (err) {
        console.log(err);
      }
    };
    const fetchTicketComments = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/ticket/comment/?ticketId=${ticketId}&employeeId=${employeeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const data = await res.json();

        setTicketCommentData(data[0].comments);
        setComment(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSingleTicket();
    fetchTicketComments();
  }, [baseUrl, ticketId, commentupdate,ticket]);
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
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const assingeeData =
    assignee.length > 0 ? assignee.map((item) => item.name) : [];
  const [assigneeArray, setAssigneeArray] = useState(assingeeData);
  useEffect(() => {
    const updatedAssigneeData =
      assignee.length > 0 ? assignee.map((item) => item.name) : [];
    setAssigneeArray(updatedAssigneeData);
  }, [assignee]);

  // const handleClosemodal = () => {
  //   setImageOpen(false);
  //   setpdfOpen(false);
  // };

  const changeTicketStatusHandler = async () => {
    try {
      const res = await fetch(`${baseUrl}/ticket/update`, {
        method: "PUT",
        body: JSON.stringify({
          ticketId: formData.ticketId,
          status: "Close",
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
  // console.log(ticket)
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
                  {ticket?.map((item, index = 0) => {
        
                   return (
                     <TicketDetails
                       key={index + 1}
                       item={item}
                       images={item?.ticketform?.files}
                     />
                   );
                  })}
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
                    role={user.role}
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
                    role={user.role}
                  />
                )}
              </div>
            </div>
          </div>
          {/* user right side for ADD USER start */}
          <div id="rightside" className="rightside">
            {ticket?.map((item, index = 0) => (
              <TaskDetails
                key={index + 1}
                ticket={ticket}
                item={item}
                ticketId={ticketId}
                assigneeArray={assigneeArray}
                role={user.role}
                assignee={assignee}
                changeTicketStatusHandler={changeTicketStatusHandler}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePreviousTicket;

{
  /* {ticket?.map((item, index) => {
                    return (
                      <div key={index}>
                        <h4 className="bText">
                          Title:-{" "}
                          <span className="spanText">
                            {item?.ticketform?.title}
                          </span>
                        </h4>
                        <h4
                          className="bText"
                          style={{ wordBreak: "break-all" }}
                        >
                          Description:-{" "}
                          <span className="spanText">
                            {item.ticketform.description}
                          </span>
                        </h4>
                      
                        <div className="mt-15">
                          {images.length > 0 && images ? (
                            <Link
                              className="btn btn-primary not-allowed"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              View Image
                            </Link>
                          ) : (
                            <Link
                              id="view-image-btn"
                              className="btn btn-primary not-allowed"
                              disabled
                            >
                              View Image
                            </Link>
                          )}

                    

                          <div
                            className="modal fade ticket-Image-modal "
                            id="exampleModal"
                            tabIndex="-1"
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="exampleModalLabel"
                                  >
                                    Images/Pdf
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <div className="ticketbox">
                                    {images ? (
                                      <div>
                                        {images.map((item, index) => (
                                          <>
                                            {item.split(".").pop() === "pdf" ? (
                                              <>
                                                <div className="ticket-image">
                                                  <div className="image">
                                                    <img
                                                      src={
                                                        "https://www.freeiconspng.com/thumbs/pdf-icon-png/pdf-icon-png-pdf-zum-download-2.png"
                                                      }
                                                      alt=""
                                                      className="ticket_image_thumbnail"
                                                    ></img>
                                                  </div>
                                                  <Link
                                                    className="image_Link"
                                                    onClick={() =>
                                                      handlepdfLink(index)
                                                    }
                                                  >
                                                    pdf link
                                                  </Link>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div className="ticket-image">
                                                  <div className="image">
                                                    <img
                                                      src={item}
                                                      alt=""
                                                      className="ticket_image_thumbnail"
                                                    ></img>
                                                  </div>
                                                  <Link
                                                    className="image_Link"
                                                    onClick={() =>
                                                      handleImageLink(index)
                                                    }
                                                  >
                                                    Image link
                                                  </Link>
                                                </div>{" "}
                                              </>
                                            )}
                                          </>
                                        ))}
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          View Image  modal   End 
                        </div>

                        {images &&
                          images.map((item, index) => (
                            <>
                              {["jpg", "png", "jpeg"].includes(
                                item.split(".").pop()
                              ) && (
                                <div
                                  className={
                                    imageopen === index
                                      ? "modal imagemodal open"
                                      : "modal"
                                  }
                                  key={index}
                                >
                                  <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">Images</h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                          onClick={() => handleClosemodal()}
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="ticket-image">
                                          <div className="image-modal">
                                            <img src={item} alt=""></img>
                                          </div>
                                        </div>
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
                              )}
                              {item.split(".").pop() === "pdf" && (
                                <div
                                  className={
                                    pdfopen === index
                                      ? "modal imagemodal open"
                                      : "modal"
                                  }
                                  key={index}
                                >
                                  <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">Pdf</h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                          onClick={() => handleClosemodal()}
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="ticket-image">
                                          <iframe
                                            src={item}
                                            width="100%"
                                            height="500px"
                                            title="PDF Viewer"
                                          ></iframe>
                                        </div>
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
                              )}
                            </>
                          ))}
                      </div>
                    );
                  })} */
}

{
  /* {currentComments ? (
                  <div className="commentbox">
                    <h4 className="commentheading">Comments</h4>
                    <div className="inputbox">
                      <textarea
                        className="form-control textareaInput mb-20"
                        type="text"
                        name="comment"
                        onChange={handleChange}
                        placeholder="Add a comment"
                        value={value}
                      />
                      <div className="text-right">
                        <button
                          className="btn btn-primary comment-button"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                        <button
                          className="btn btn-primary ml-10 comment-button"
                          onClick={handleClick}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    {currentComments?.map((item, index) => {
                      return (
                        <div key={index}>
                          <div className="commentdetail">
                            <p className="cText">
                              <span className="cName">
                                {item.commentedBy}&nbsp;:-
                              </span>{" "}
                              Replied
                            </p>
                            <p className="cText cComnt">
                              <span className="">{item.comment}</span>
                            </p>
                            <p className="cText cComnt">
                              {" "}
                              <span className="cmnt-ON">Commented on : </span>
                              &nbsp;<span className="cdate">{item.time}</span>,
                              &nbsp;<span className="ctime">{item.date}</span>
                            </p>
                            <hr></hr>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="commentbox mt-30 mb-30">
                    <h3 className="commentheading">Comments</h3>
                    <div className="inputbox">
                      <textarea
                        className="form-control textareaInput mb-20"
                        type="text"
                        name="comment"
                        onChange={handleChange}
                        placeholder="Add a comment"
                        value={value}
                      />
                      <div className="text-right">
                        <button
                          className="btn btn-primary comment-button"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                        <button
                          className="btn btn-primary ml-10 comment-button"
                          onClick={handleClick}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Pagination buttons 
                {totalPages > 1 && (
                  <div className="pagination-container m-0">
                    <button
                      className="btn btn-custom"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </button>
                    <span className="pagination-info">
                      Comments {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-custom"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )} */
}
{
  /* {ticket?.map((item, index) => {
              const assigneeName =
                assigneeArray.length > 0
                  ? assigneeArray[ticketId % assigneeArray.length]
                  : [];
              return (
                <div key={index}>
                  <div className="details-box">
                    <div className="Heading">Task Assignee Details</div>
                    <ul className="assineeDetails">
                      <li>
                        <span className="btext">Assignee: </span>
                        <span className="tickettext">
                          {item.assignee?.name
                            ? item.assignee?.name
                            : "IT Members"}
                        </span>
                      </li>
                      <li>
                        <span className="btext">
                          <i className="fa-regular fa-user"></i>&nbsp;Raise By:
                        </span>
                        <span className="tickettext">
                          {ticket[0]?.ticketform?.reporter
                            ? ticket[0]?.ticketform?.reporter
                            : "-"}
                        </span>
                      </li>
                      <li>
                        <span className="btext">Priority: </span>
                        <span className="tickettext">
                          {item?.ticketform?.priority}
                        </span>
                      </li>
                      <li>
                        <span className="btext">Assignee To: </span>
                        <span className="tickettext">
                          {item.assignee?.name
                            ? item.assignee?.name
                            : assigneeName}
                        </span>
                      </li>
                      <li>
                        <span className="btext">Status: </span>
                        <span className="tickettext">{item.status}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })} */
}
