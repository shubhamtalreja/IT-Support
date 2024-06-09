import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";


const PageNotFound = () => {

  const navigate = useNavigate();
  const token =(Cookies.get("token"));
  const decodedToken = jwt_decode(token);
  const user = decodedToken.role;
  return (
    <div style={{ marginLeft: "250px", marginTop: "100px" }}>
      <img
        src="https://www.pngkey.com/png/detail/52-520194_error-404-page-was-not-found-news-http.png"
        alt="Page not found"
      />

      <div>
        <button
          style={{
            border: "none",
            backgroundColor: "#287189",
            color: "white",
            marginLeft: "350px",
            marginTop: "20px",
            padding: "12px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(`/${user}/dashboard/maindashboard`);
          }}
        >
          Home Page
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
