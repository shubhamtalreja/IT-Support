import { React, useEffect, useRef, useState } from "react";
import FormData from "form-data";
import baseURL from "../../../config/default.json";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const UserTicketForm = () => {
  const user = {
    email: jwt_decode(Cookies.get("token")).email,
    role: jwt_decode(Cookies.get("token")).role,
    employeeID: jwt_decode(Cookies.get("token")).employeeID,
    name: jwt_decode(Cookies.get("token")).name,
    userId: jwt_decode(Cookies.get("token")).userId,
    password: jwt_decode(Cookies.get("token")).Password,
    reporter: jwt_decode(Cookies.get("token")).name,
    reporterId: jwt_decode(Cookies.get("token")).employeeID,
  };
  const baseUrl = baseURL.baseUrl;
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(user);
  const [users, setUsers] = useState([]);
  const [ItUserEmails, setItUserEmails] = useState([]);
  const [adminuseremail, setadminuseremail] = useState([]);
  const [email, setEmail] = useState();
  const [message, setMessage] = useState();
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [count, setCount] = useState();
  const [counterSubmitted, setCounterSubmitted] = useState(false);
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  const form = new FormData();
  const counts = useRef({});
  const isFirstRender = useRef(true);
  useEffect(() => {
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

    fetchData();
  }, []);

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

  const handleChange = (e) => {
    if (e.target.name === "file") {
      for (let i = 0; i < e.target.files.length; i++) {
        form.append("files", e.target.files[i]);
      }
    } else {
      let value = e.target.value;
      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value.charAt(0).toUpperCase() + value.slice(1),
        itEmails: itEmails,
        adminemail: adminemail,
        ticketId: count,
        reporter: user.name,
        reporterId: user.employeeID,
      });
      if (!counterSubmitted) {
        setCounterSubmitted(true);
        setCounter(counter + 1);
      }
    }
    setIsFormFilled(checkIsFormFilled());
  };

  const checkIsFormFilled = () => {
    if (formData.title && formData.description && formData.priority) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    // Append the remaining form fields to the form object
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("priority", formData.priority);
    form.append("reporter", formData.reporter);
    form.append("reporterId", formData.reporterId);
    // form.append("status", "Open");
    // Object.keys(formData).forEach((key) => form.append(key, formData[key]);

    let a = validate(formData);
    setError(a);
    if (Object.keys(a).length === 0) {
      try {
        const response = await fetch(`${baseUrl}/ticket/ticket`, {
          method: "POST",
          body: form, // Use the form object as the request body
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        console.log("response", response);
        setOpen(true);
        sendemailtoadminandit();
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    handleSubmitNewTicket();
  }, [counter]);
  const handleSubmitNewTicket = async () => {
    try {
      const response = await fetch(`${baseUrl}/ticket/ticketcount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();
      counts.current = { ...data };
      const countss = counts.current.count + 1;
      setCount(countss);
    } catch (err) {
      console.log(err);
    }
  };
  const validate = (formData) => {
    const errors = {};
    if (!formData.title) {
      errors.title = "Field is required";
    }
    if (!formData.description) {
      errors.description = "Field is required";
    }
    if (!formData.priority) {
      errors.priority = "Field is required";
    }
    return errors;
  };

  // const sendemailtoadminandit = async (event) => {
  //   const bodyContent = JSON.stringify({
  //     adminEmails: adminemail,
  //     description: formData.description,
  //     email: formData.email,
  //     employeeID: formData.employeeID,
  //     itEmails: itEmails,
  //     name: formData.name,
  //     priority: formData.priority,
  //     role: formData.role,
  //     ticketId: formData.ticketId,
  //     title: formData.title,
  //     reporter: formData.name,
  //   });
  //   try {
  //     const response = await fetch(`${baseUrl}/user/sendemailtoadminandit`, {
  //       method: "POST",
  //       body: JSON.stringify(bodyContent),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${Cookies.get("token")}`,
  //       },
  //     });
  //     const data = await response.json();
  //     if (data.status === 201) {
  //       setEmail("");
  //       setMessage(true);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleClosemodal = () => {
    setOpen(false);
    navigate("/user/dashboard/Homepage");
  };
  const handleModalOpen = () => {
    setOpen(true);
    handleSubmit();
  };

  const sendemailtoadminandit = async (event) => {
    const bodyContent = JSON.stringify({
      // adminEmails: adminemail,
      description: formData.description,
      email: formData.email,
      employeeID: formData.employeeID,
      // itEmails: itEmails,
      name: formData.name,
      priority: formData.priority,
      role: formData.role,
      ticketId: formData.ticketId,
      title: formData.title,
      reporter: formData.name,
    });
    try {
      const response = await fetch(`${baseUrl}/user/sendemailtoadminandit`, {
        method: "POST",
        // body: JSON.stringify(formData),
        body: bodyContent,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await response.json();
      if (data.status === 201) {
        setEmail("");
        setMessage(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="wrapperDiv">
        <div className="container">
          <div>
            <h2 className="Heading">Raise A Ticket</h2>
          </div>

          <div className="formContent">
            <div className="row mb-20">
              <div className="col-md-6 col-sm-12">
                <label className="form-label form-label-text">Title</label>
                <input
                  className={error.title ? "form-control err" : "form-control"}
                  name="title"
                  type="text"
                  onChange={handleChange}
                  autoFocus
                />
                {error.title ? (
                  <p className="errorText">* {error.title}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="form-label form-label-text">Name</label>
                <input
                  className="form-control"
                  type="text"
                  defaultValue={user.name}
                  readOnly={true}
                />
              </div>
            </div>

            <div className="row mb-20">
              <div className="col-md-6 col-sm-12">
                <label className="form-label form-label-text">Email</label>
                <input
                  className="form-control"
                  type="text"
                  defaultValue={user.email}
                  readOnly={true}
                />
              </div>
              <div className="col-md-6 col-sm-12">
                <label className="form-label form-label-text">Priority</label>
                <select
                  className={
                    error.priority ? "form-control err" : "form-control"
                  }
                  name="priority"
                  onClick={handleChange}
                  placeholder="Priority"
                >
                  <option>Select</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {error.priority ? (
                  <p className="errorText">* {error.priority}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="row mb-20">
              <div className="col-md-6 col-sm-12">
                <label className="form-label form-label-text">
                  Reporter Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  defaultValue={user.name}
                  readOnly={true}
                />
              </div>
            </div>
            <div className="row mb-20">
              <div className="col-md-12 col-sm-12">
                <label className="form-label form-label-text">
                  Description
                </label>
                <textarea
                  className={
                    error.description ? "form-control err" : "form-control"
                  }
                  type="text"
                  name="description"
                  placeholder="Enter your concern...."
                  onChange={handleChange}
                />
                {error.description ? (
                  <p className="errorText">* {error.description}</p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <label
                  htmlFor="images"
                  className="form-label form-label-text drop-container"
                >
                  <span className="drop-title">
                    Drop files here <br /> or{" "}
                  </span>{" "}
                  <br></br>
                  <input
                    className="Choose-files"
                    type="file"
                    id="images"
                    name="file"
                    multiple
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </label>
              </div>
              <div className="col-md-6 col-sm-12">
                <Link
                  id="view-image-btn"
                  className="btn btn-primary create-button"
                  onClick={!isFormFilled ? null : handleModalOpen}
                  disabled={!isFormFilled}
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ======Modal======= */}
      <div className={open ? "modal successModal open" : "modal"}>
        <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Success</h5>
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
                &nbsp;Ticket is Raised successfully
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
    </>
  );
};
export default UserTicketForm;
