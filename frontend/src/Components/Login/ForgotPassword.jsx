import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import baseURL from "../../config/default.json";
const ForgotPassword = () => {
  const baseUrl = baseURL.baseUrl;
  const history = useNavigate();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState({});
  const { id, token } = useParams();
  const [icon, setIcon] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPasswordModal, setshowPasswordModal] = useState(false);
  const [open, setOpen] = useState(false);
  const check = <i className="fa-solid fa-circle-check"></i>;
  const cross = <i className="fa-sharp fa-solid fa-circle-xmark"></i>;
  const [passwordvalidation, setPasswordvalidation] = useState({
    length: false,
    upperCase: false,
    number: false,
    specialChar: false,
  });
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
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handlepasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordvalidation({
      length: value.length >= 8,
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };
  const userValid = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/forgotpassword/${id}/${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (data.status === 201) {
        console.log("User Valid");
      } else {
        history("*");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError({ password: "Please enter your password and confirm it" });
    } else if (password !== confirmPassword) {
      setError({ password: "Passwords do not match" });
    }
    else{
      try {
        const response = await fetch(`${baseUrl}/user/${id}/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
  
        const data = await response.json();
  
        if (data.status === 201) {
          setPassword("");
          setMessage(true);
        } else {
          if (password !== confirmPassword) {
            setError({ password: "please enter the right password" });
          } else {
            setOpen(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  const handleCloseModal = () => {
    if (open === true) {
      setOpen(false);
      history("/");
    }
  };
  useEffect(() => {
    userValid();
  }, []);

  return (
    <div className="wrapperDiv resetPassword">
      <div className="container">
        <div>
          <h2 className="Heading">Enter your new password</h2>
        </div>
        <div className="formContent">
           <div className="col-md-12 col-sm-12">
                  <label className="form-label form-label-text">Password</label>
                  <div className="inputDiv input-eye-password">
                    <input
                      className={error.password ? "form-control err" : "form-control"}
                      type={icon?"text":"password"}
                      name="password"
                      onChange={handlepasswordChange}
                      onFocus={handleFocus}
                    />
                    <span className="eyeoffon" onClick={()=>setIcon(!icon)}>
                      {icon?<i className="fa-sharp fa-solid fa-eye"></i>:
                      <i className="fa-sharp fa-solid fa-eye-slash"></i>}
                    </span>
                    {error.password ? (
                      <p className="errorText"><span >{error.password}</span> </p>
                    ) : (
                      ""
                    )}
                    <Link href="javascript:void(0);" className="tipsModal tipstext" onClick={() => setshowPasswordModal(true)}>Password Tips & Hints</Link>
                  </div>
                  <div className="tipsandhints">
                    {isFocused && (
                        <ul>
                          <li
                            style={{
                              color: passwordvalidation.length ? "green" : "red"
                            }}
                          >
                            {passwordvalidation.length ? check : cross} 8 characters minimum
                          </li>
        
                          <li
                            style={{
                              color: passwordvalidation.upperCase ? "green" : "red"
                            }}
                          >
                            {passwordvalidation.upperCase ? check : cross} 1 uppercase letter
                          </li>
                          <li
                            style={{
                              color: passwordvalidation.lowerCase ? "green" : "red"
                            }}
                          >
                            {passwordvalidation.lowerCase ? check : cross } 1 lowerCase letter
                          </li>
                          <li
                            style={{
                              color: passwordvalidation.number ? "green" : "red"
                            }}
                          >
                            {passwordvalidation.number ? check : cross } 1 number
                          </li>
                          <li
                            style={{
                              color: passwordvalidation.specialChar ? "green" : "red"
                            }}
                          >
                            {passwordvalidation.specialChar ? check : cross } 1 special character
                          </li>
                        </ul>
                      )}
                  </div>
              </div>

          <div className="row mb-20">
            <div className="col-md-12 col-sm-12">
              <label className="form-label form-label-text">
                Confirm Password
              </label>
              <input
                className="form-control"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error.password ? (
              <p className="errorText">{error.password}</p>
              ) : (
                  ""
                )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <button className="btn btn-primary" onClick={submitHandler} ref={submitButtonRef}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

       {/* ========= Tips Modal ============== */}
       <div className={showPasswordModal ? "modal termsCondtions-modal open" : "modal"}>
        <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Password Tips & Hints</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setshowPasswordModal(false)}></button>
            </div>
            <div className="modal-body">
              <div>
                <p>✓ Must be a minimum of 8 characters</p>
                <p>
                  ✓ Your password should be easy for you to remember and hard for others
                  to guess.
                </p>
                <p>
                  ✓ Consider a password phrase of random words or something meaningful to
                  you. For example, "Seize the Day 2014"
                </p>
                <p>✓ Do not use any part of your phone number or birth date.</p>
                <p>✓ Make your password unique to IT-Support.</p>
                <p>✓ You can use an online password generator.</p>
                <p>
                  ✓ Password should have an uppercase letter, lowercase letter, number,
                  and a special character
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========== For Forget Password =========== */}
      <div className={open ? "modal successModal open" : "modal"}>
          <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
          <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Success</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  onClick={() => handleCloseModal()}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0"><i className="fa-sharp fa-regular fa-circle-check"></i> &nbsp;Your password has been changed successfully</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleCloseModal()}>Close</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};



export default ForgotPassword