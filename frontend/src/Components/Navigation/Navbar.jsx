import React, { useEffect, useState,useContext} from "react";
import {Link} from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";
import {CustomContext} from '../../App';


const Navbar = () => {
  const {imageURL} = useContext(CustomContext);  
    const[navbarOpen,setNavbarOpen]=useState(false);   

  const user = {
    email: jwt_decode(Cookies.get("token")).email,
    role: jwt_decode(Cookies.get("token")).role,
    employeeID: jwt_decode(Cookies.get("token")).employeeID,
    name: jwt_decode(Cookies.get("token")).name,
    userId: jwt_decode(Cookies.get("token")).userId
  };
useEffect(()=>{
  setNavbarOpen(false);
},[navbarOpen])

  const role = user.role;
  let employeeId=user.employeeID;
  const initials = user.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase(); 




  const getImageOrInital = () => {
    return imageURL!=="undefined" && imageURL? (
      <img src={imageURL} alt="User Avatar" className="avatars" />
      )  : (
        initials && <span className="avatars">{initials}</span>
      )
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary custum-navbar fixed-top">
        <div className="container-fluid">
        {role === "user" && (
          <Link className="navbar-brand" to="/user/dashboard/maindashboard"
          >
            IT-Support
          </Link>
        )}
         {role === "admin" && (
          <Link className="navbar-brand" to="/admin/dashboard/maindashboard"
          >
            IT-Support
          </Link>
        )}
        {role === "it" && (
          <Link className="navbar-brand" to="/it/dashboard/maindashboard"
          >
            IT-Support
          </Link>
        )}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {role === "user" && (
            <>
              <div
                className={`collapse navbar-collapse navbarMob ${
                  navbarOpen ? "show" : ""
                }`}
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      to="/user/dashboard/maindashboard"
                      aria-current="page"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-dashboard fa-ico"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/user/dashboard"

                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-clipboard-list fa-ico"></i>
                      Create Ticket
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/user/dashboard/Homepage"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-clipboard-list fa-ico"></i>
                      Current Ticket
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/user/dashboard/previousticket"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-ticket fa-ico"></i>
                      Resolved Ticket
                    </Link>
                  </li>
                  </ul>
              </div>
                  <div className="dropdown proAvatar">
                    <div className="dropdown">
                      <Link
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                         <div className="circle">
                         {getImageOrInital()}
                          </div>
                      </Link>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/user/dashboard/profilepage`}
                          >
                            Profile
                            <span className="ico"><i className="fa-regular fa-user"></i></span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="#"
                            to='/resetpassword'
                          >
                            New password
                            <span className="icon"><i className="fa fa-key" aria-hidden="true"></i></span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="#"
                            to="/"
                            onClick={() => {
                              Cookies.remove("token");
                            }}
                          >
                            Logout
                            <span className="ico"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                          </Link>
                        </li>
                      </ul>
                    </div>
              </div>
            </>
          )}
          {role === "admin" && (
            <>
              <div
                className={`collapse navbar-collapse navbarMob ${
                  navbarOpen ? "show" : ""
                }`}
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/admin/dashboard/maindashboard"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-dashboard fa-ico"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/admin/dashboard"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-clipboard-list fa-ico"></i>
                      Add New User
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/admin/dashboard/alluser"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-clipboard-list fa-ico"></i>
                      All User
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/admin/dashboard/allticket"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-ticket fa-ico"></i>
                      All Ticket
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/admin/dashboard/MailOptions"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-ticket fa-ico"></i>
                      Mail Options
                    </Link>
                  </li>
                  </ul>
              </div>
                  <div className="dropdown proAvatar">
                    <div className="dropdown">
                      <Link
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                       <div className="circle">
                        {getImageOrInital()}
                        </div>
                      </Link>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            to = {`/admin/dashboard/profilepage`}
                          >
                            Profile
                            <span className="ico"><i className="fa-regular fa-user"></i></span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="#"
                            to ="/resetpassword"
                          >
                            New password
                            <span className="icon"><i className="fa fa-key" aria-hidden="true"></i></span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="#"
                            to="/"
                            onClick={() => {
                              Cookies.remove("token");
                            }}
                          >
                            Logout
                            <span className="ico"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                          </Link>
                        </li>
                      </ul>
                    </div>
              </div>
            </>
          )}
          {role === "it" && (
            <>
              <div
                className={`collapse navbar-collapse navbarMob ${
                  navbarOpen ? "show" : ""
                }`}
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/it/dashboard/maindashboard"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-dashboard fa-ico"></i>
                      Dashboard
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/it/dashboard/NewTicket"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-clipboard-list fa-ico"></i>
                      Current Ticket
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/it/dashboard"
                      onClick={() => {
                        setNavbarOpen(!navbarOpen);
                      }}
                      aria-expanded={navbarOpen ? "true" : "false"}
                    >
                      <i className="fa-solid fa-ticket fa-ico"></i>
                      Resolved Ticket
                    </Link>
                  </li>
                  </ul>
              </div>
                  <div className="dropdown proAvatar">
                    <div className="dropdown">
                      <Link
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                          <div className="circle">
                            {getImageOrInital()}
                            </div>
                      </Link>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/it/dashboard/profilepage`}
                          >
                            Profile
                            <span className="ico"><i className="fa-regular fa-user"></i></span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/resetpassword"
                          >
                            New password
                            <span className="icon"><i className="fa fa-key" aria-hidden="true"></i></span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/"
                            onClick={() => {
                              Cookies.remove("token");
                            }}
                          >
                            Logout
                            <span className="ico"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                          </Link>
                        </li>
                      </ul>
                    </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
