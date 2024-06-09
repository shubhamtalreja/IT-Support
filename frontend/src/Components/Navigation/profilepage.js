import React, { useState, useEffect, useContext } from "react";
import baseURL from "./../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { CustomContext } from "../../App";

const ProfilePage = () => {
  const { imageURL, setImageURL } = useContext(CustomContext);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [count, setCount] = useState(0);
  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showNoImageModal, setShowNoImageModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    employeeID: "",
    name: "",
    userId: "",
    password: "",
  });

  const form = new FormData();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageOpen, setModalImageOpen] = useState(false);

  useEffect(() => {
    const fetchUserRole = () => {
      try {
        const user = {
          email: jwt_decode(Cookies.get("token")).email,
          role: jwt_decode(Cookies.get("token")).role,
          employeeID: jwt_decode(Cookies.get("token")).employeeID,
          name: jwt_decode(Cookies.get("token")).name,
          userId: jwt_decode(Cookies.get("token")).userId,
        };
        setUser(user);
        setRole(user.role);
        setFormData(user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserRole();
  }, []);
  const baseUrl = baseURL.baseUrl;
  const handleImageChange = async (e) => {
    if (e.target.name === "file") {
      for (let i = 0; i < e.target.files.length; i++) {
        form.append("files", e.target.files[i]);
      }
    } else {
      setFormData({
        ...formData,
        userId: user.userId,
      });
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    try {
      const res = await fetch(`${baseUrl}/ticket/profileimage`, {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      console.log("response", res);
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/ticket/getProfileImages?userId=${formData.userId}&role=${formData.role}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const data = await res.json();
        const imageInfo = data.imageUrls ? data.imageUrls[0] : navigator;
        setImageURL(imageInfo);
        localStorage.setItem("imageURL", imageInfo);
      } catch (error) {
        console.log(error);
      }
    };
    if (formData.role && formData.userId) {
      fetchData();
    }
  }, [count, formData.role, formData.userId]);
  const handleDeleteImage = async () => {
    if (!imageURL) {
      setShowNoImageModal(true);
      return;
    }
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = async () => {
    setShowDeleteConfirmation(false);
    try {
      const res = await fetch(`${baseUrl}/user/deleteProfileImage`, {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          image: imageURL,
          role: formData.role,
        }),
      });
      if (res.ok) {
        localStorage.removeItem("imageURL");
        setImageURL(null);
        console.log("Image deleted successfully.");
      } else {
        console.log("Image deletion failed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleImageModal = () => {
    setModalImageOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleImageModalClose = () => {
    setModalImageOpen(false);
  };

  let dashboardLink = "/user/dashboard";
  if (role === "it") {
    dashboardLink = "/it/dashboard";
  } else if (role === "admin") {
    dashboardLink = "/admin/dashboard/allticket";
  }
  if (!user) {
    return (
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
    );
  }
  const handleExternalLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    // ================ Profile ===============//
    <>
      <div className="wrapperDiv profile-page ">
        <div className="profileWrapper">
          <div className="profile-Sec">
            {/* Profile Avatar Start  */}
            <div className="avatar">
              <div
                className="empty-circle"
                onMouseEnter={() => {
                  setShowCameraIcon(true);
                  setShowEditIcon(true);
                }}
                onMouseLeave={() => {
                  setShowCameraIcon(false);
                  setShowEditIcon(false);
                }}
              >
                {imageURL ? (
                  <img src={imageURL} alt="" />
                ) : (
                  <img
                    style={{
                      border: "2px solid black",
                      opacity: showCameraIcon ? "0.7" : "1",
                      position: "relative",
                      width: "200px",
                      height: "200px",
                      margin: "0 auto",
                      borderRadius: "50%",
                    }}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgOm2LuId_WkIuaCpuGYldjjC1c_Zi134yRg&usqp=CAU"
                    alt="Profile"
                  />
                )}
                {showCameraIcon && (
                  <div className="camera-icon">
                    <div className="camera">
                      <i
                        className="fa-solid fa-camera"
                        onClick={() =>
                          document.getElementById("camera-icon").click()
                        }
                      ></i>
                    </div>
                    <input
                      type="file"
                      id="camera-icon"
                      name="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                )}
                {showEditIcon && (
                  <div className="edit-icon">
                    <i
                      className="fa-solid fa-pen"
                      onClick={handleImageModal}
                    ></i>
                  </div>
                )}
              </div>
            </div>
            <div className="pDescription">
              <i className="fas fa-edit" onClick={handleModalOpen}></i>
              <h4 className="cName">{user.name}</h4>
              <p className="cPosition">{formData.role}</p>
              <p className="cInstitute">
                IT Support
              </p>
              <p className="cEmail">{user.email}</p>
              <ul className="social-contact">
                <li>
                  <div
                    onClick={() =>
                      handleExternalLink("https://twitter.com/i/flow/login")
                    }
                  >
                    <i className="fa fa-twitter Links"></i>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() =>
                      handleExternalLink(
                        "https://www.linkedin.com/in/shubham-talreja-b04697205/"
                      )
                    }
                  >
                    <i className="fa fa-linkedin Links"></i>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() =>
                      handleExternalLink(
                        "https://github.com/shubhamtalreja"
                      )
                    }
                  >
                    <i className="fa fa-github Links"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={modalOpen ? "modal  ticket-Image-modal open" : "modal"}>
          <div className={`modal-backdrop ${modalOpen ? "active" : ""}`}></div>
          <div className="modal-dialog modal-dialog-centered modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  View Profile
                </h5>
                <span className="close" onClick={handleModalClose}>
                  &times;
                </span>
              </div>
              <div className="modal-body edit-form">
                <form>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                    }}
                    disabled
                  />
                  <label htmlFor="role">Role:</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    disabled
                  />
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    disabled
                  />
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            modalImageOpen ? "modal  ticket-Image-modal open" : "modal"
          }
        >
          <div
            className={`modal-backdrop ${modalImageOpen ? "active" : ""}`}
          ></div>
          <div className="modal-dialog modal-dialog-centered modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Image Preview
                </h5>
                <span className="close" onClick={handleImageModalClose}>
                  &times;
                </span>
              </div>
              <div className="modal-body">
                {imageURL ? (
                  <img src={imageURL} alt="" />
                ) : (
                  <img
                    style={{
                      border: "2px solid black",
                      opacity: showCameraIcon ? "0.7" : "1",
                      position: "relative",
                      width: "200px",
                      height: "200px",
                      margin: "0 auto",
                      borderRadius: "50%",
                    }}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgOm2LuId_WkIuaCpuGYldjjC1c_Zi134yRg&usqp=CAU"
                    alt="Profile"
                  />
                )}
                <div className="modal-footer deleteImage">
                  <i
                    className="fa-sharp fa-solid fa-trash"
                    onClick={handleDeleteImage}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <div
          className={`modal  ticket-Image-modal ${
            showDeleteConfirmation ? "open" : ""
          }`}
        >
          <div
            className={`modal-backdrop ${
              showDeleteConfirmation ? "active" : ""
            }`}
          ></div>
          <div className="modal-dialog modal-dialog-centered modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Image
                </h5>
                <span
                  className="close"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  &times;
                </span>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the profile image?</p>
                <div className="modal-footer">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteConfirmation}
                  >
                    Sure
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* No Image Modal */}
        <div
          className={`modal  ticket-Image-modal ${
            showNoImageModal ? "open" : ""
          }`}
        >
          <div
            className={`modal-backdrop ${showNoImageModal ? "active" : ""}`}
          ></div>
          <div className="modal-dialog modal-dialog-centered modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  No Image to Delete
                </h5>
                <span
                  className="close"
                  onClick={() => setShowNoImageModal(false)}
                >
                  &times;
                </span>
              </div>
              <div className="modal-body">
                <p>There is no image to delete.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowNoImageModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
