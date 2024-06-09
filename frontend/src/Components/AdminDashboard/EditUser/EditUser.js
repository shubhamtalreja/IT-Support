import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import baseURL from "../../../config/default.json";
import Cookies from "js-cookie";

const EditUser = () => {
  const baseUrl = baseURL.baseUrl;
  const navigate = useNavigate();
  const { employeeID } = useParams();
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    employeeID: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsFormFilled(checkIsFormFilled());
  };
  const checkIsFormFilled = () => {
    if (formData.name || formData.employeeID || formData.role) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    let a = validate(formData);
    setError(a);
    if (Object.keys(a).length === 0) {
      try {
        const response = await fetch(`${baseUrl}/user/edit`, {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const data = await response.json();
        setOpen(true);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const validate = (formData) => {
    const errors = {};
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = "*Invalid Email ";
    } else if (!(formData.email.split("@")[1] == "gmail.com")) {
      errors.email = "*Invalid Email ";
    } else if (!formData.email.split("@")[0].includes(".")) {
      errors.email = "*Invalid Email ";
    }
    return errors;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/user/singleuser?employeeID=${employeeID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const viewImageBtn = document.getElementById("view-image-btn");
    if (viewImageBtn && viewImageBtn.hasAttribute("disabled")) {
      viewImageBtn.removeAttribute("data-bs-toggle");
      viewImageBtn.removeAttribute("data-bs-target");
    }
  }, []);
  const handleBothClick = () => {
    handleSubmit();
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
    navigate("/admin/dashboard/alluser");
  };
  return (
    <>
      <div className="wrapperDiv">
        <div className="container">
          <div className="resetPassword">
            <div>
              <h1 className="Heading"> Update User Detail</h1>
            </div>
            <div className="formContent">
              <div className="row mb-20">
                <div className="col-md-12 col-sm-12">
                  <label className="form-label form-label-text">
                    Employee Id
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="employeeID"
                    value={formData?.employeeID}
                    disabled
                  />
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-md-12 col-sm-12">
                  <label className="form-label form-label-text">
                    User Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-md-12 col-sm-12">
                  <label className="form-label form-label-text">
                    Email Address
                  </label>
                  <input
                    className={
                      error?.email ? "form-control err" : "form-control"
                    }
                    type="text"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                  />
                  {error.email ? (
                    <p className="errorText">{error.email}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-md-12 col-sm-12">
                  <label className="form-label form-label-text">Role</label>
                  <select
                    className={error?.role ? "form-control err" : "form-control"}
                    name="role"
                    value={formData?.role}
                    onChange={handleChange}
                  >
                    <option>Select</option>
                    <option value={"it"}>IT</option>
                    <option value={"admin"}>Admin</option>
                    <option value={"user"}>User</option>
                  </select>
                </div>
              </div>
              <div className="text-center">
                <Link
                  id="view-image-btn"
                  className="btn btn-primary loginbtn update-btn"
                  onClick={!isFormFilled ? null : handleBothClick}
                  disabled={!isFormFilled}
                >
                  update
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Modal ========== */}
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
                onClick={() => handleCloseModal()}
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">
                <i className="fa-sharp fa-regular fa-circle-check"></i>{" "}
                &nbsp;User detail has been updated
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => handleCloseModal()}
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

export default EditUser;
