import React, { useState, useEffect,useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import baseURL from "../../config/default.json"
import Cookies from 'js-cookie';
import {CustomContext} from '../../App'

const Login = () => {
  const {setImageURL} = useContext(CustomContext);  
  const baseUrl = baseURL.baseUrl;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [firstTime, setFirstTime] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitButtonRef.current.click();
      }
    }

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange=(e)=>{
    setPassword(e.target.value);
  }
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      email,
      password,
    };
    const validationErrors = validate(payload);
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(`${baseUrl}/user/login`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
        const res = await response.json();
        const token = res.token;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const role = decodedToken.role;
        Cookies.set("token", token);

        setImageURL(decodedToken.userImageURL);  
        if (role === "user") {
          navigate("/user/dashboard/maindashboard");
        } else if (role === "it") {
          navigate("/it/dashboard/maindashboard");
        } else {
          navigate("/admin/dashboard/maindashboard");
        }

        const profileImagesResponse = await fetch(`${baseUrl}/ticket/getProfileImages?userId=${decodedToken.userId}&role=${role}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const profileImagesData = await profileImagesResponse.json();
        const imageInfo = profileImagesData.imageUrls ? profileImagesData.imageUrls[0] : null;
        setImageURL(imageInfo);
        localStorage.setItem("imageURL", imageInfo);      
      }
      else{
        setError({ password: "Username or password not matched" });
      }
      } catch (error) {
        setError({ password: "Username or password not matched" });
      }
    }
  };
  const validate = (payload) => {
    const errors = {};
    if (!payload.email) {
      errors.email = "*Field is required";
    }
    else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(payload.email)
    ) {
      errors.email = "*Email should contain @,.";
    } else if (!["gmail.com"].includes(payload.email.split("@")[1])) {
      errors.email = "*Invalid email subdomain";
    }
    else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]{2,3}$/.test(payload.email)) {
      errors.email = "*Invalid email format";
    }
    if (!payload.password) {
      errors.password = "*Field is required";
    }
    if (Object.keys(errors).length == 0) {
      setDisabled(false);
    }
    setError(errors);
    return errors;
  };

  useEffect(() => {
    if (!firstTime) {
      validate({ email, password });
    }
    setFirstTime(false);
  }, [password, email])

  useEffect(() => {
    const viewImageBtn = document.getElementById('view-image-btn');
    if (viewImageBtn && viewImageBtn.hasAttribute('disabled')) {
      viewImageBtn.removeAttribute('data-bs-toggle');
      viewImageBtn.removeAttribute('data-bs-target');
    }
  }, []);
  return (
    <div className="maincontainer h-100">
      {/* <div className="image-div left-div">
        <div className="content-center h-100">
          <div className="background"></div>
        </div>
      </div> */}

      <div className="login right-div">
        <div className="content-center h-100">
          <div className="form-panel">
          <form onSubmit={handleFormSubmit}>
            <div>
              <h1 className="lead text-white">Login Your Account</h1>
            </div>
            <div>
              <div className="form-Div">
                <label className="form-label">Email Address</label>
                <input
                  className={error.email ? "form-control err" : "form-control"}
                  type="text"
                  onChange={handleEmailChange}
                  placeholder="Email Address"
                  autoFocus
                />
                {error.email ? <p className="errorText">{error.email}</p> : ""}
              </div>
              <div className="form-Div">
                <label className="form-label">Password</label>
                <div className="input-group input-password">
                  <input
                  className={error.password ? "form-control err" : "form-control"}
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  />
                  <button
                  className="input-group-append"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  >
                    {showPassword ? <i className="fa-sharp fa-solid fa-eye"></i> : <i className="fa-sharp fa-solid fa-eye-slash"></i>}
                    </button>
                </div>
                    {error.password ? (
                    <p className="errorText">{error.password}</p>
                    ) : (
                      ""
                    )}
                </div>
              <div className="footer-btn text-right">
                    <Link id="view-image-btn" className="btn btn-primary loginBtn pull-left" onClick={disabled ? null:handleFormSubmit} disabled={disabled} ref={submitButtonRef}>LOGIN</Link>
                    <Link className="textSpanForgot mt-15" to="/resetpassword">Forgot Password ?</Link>
                </div>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login };
