import React, { useState, useEffect } from "react";
import { useNavigate,Link } from 'react-router-dom';
import baseURL from "../../../config/default.json"
import Cookies from 'js-cookie';

const MailOptions = () => {
  
  const baseUrl = baseURL.baseUrl;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [showPasswordModal, setshowPasswordModal] = useState(false);
  const [errormessage,setErrormessage]=useState(false);
  const [password, setPassword] = useState("");
  const [icon,setIcon]=useState(false);
  const check= <i className="fa-solid fa-circle-check"></i> ;
  const cross= <i className="fa-sharp fa-solid fa-circle-xmark"></i>
  const [passwordvalidation, setPasswordvalidation] = useState({
    length: false,
    upperCase: false,
    number: false,
    specialChar: false
  })

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
    navigate('/admin/dashboard/allticket');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handlePasswordChange = (e) => {
    const value=e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setPassword(value);
    setPasswordvalidation({
      length: value.length >= 8,
      lowerCase: /[a-z]/.test(value)
    })
  };
  const handleSubmit = async () => {
    let a = validate(formData);
    setError(a);
    if (Object.keys(a).length == 0) {
      try {
        const response = await fetch(`${baseUrl}/user/settings`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
  
        if (response.status === 400) {
          const { message } = await response.json();
          setErrormessage(true);
        } else {
          const data = await response.json();
          setOpen(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validate = (formData) => {
    const errors = {};

    if (!formData.Host) {
        errors.Host = "*Field is required";
    } 
    else if (!/^[\w.-]+\.[\w.-]+\.\w{2,3}$/.test(formData.Host)) {
        errors.Host = "*Invalid email format";
    }
    if (!formData.email) {
      errors.email = "*Field is required";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      errors.email = "*Email should contain @,. ";
    } else if (!(formData.email.split("@")[1] == "gmail.com")) {
      errors.email = "*Invalid email subdomain ";
    } else if (!formData.email.split("@")[0].includes(".")) {
      errors.email = "*Email format error ";
    }
    if (!formData.password) {
      errors.password = "*Field is required";
    } 
    if(!formData.port){
      errors.port = "*Field is Required"
    }else{
      const test = /^\d{3}$/.test(formData.port)
      if(!test)
      errors.port = "*Port only contains 3 digit numbers" 
    }
    if (Object.keys(errors).length == 0) {
      setDisabled(false);
    }
    setError(errors);
    return errors;
  };
  useEffect(() => {
    if (!firstTime) {
      validate(formData);
    }
    setFirstTime(false);
  }, [formData])

  useEffect(() => {
      const viewImageBtn = document.getElementById('view-image-btn');
      if (viewImageBtn && viewImageBtn.hasAttribute('disabled')) {
        viewImageBtn.removeAttribute('data-bs-toggle');
        viewImageBtn.removeAttribute('data-bs-target');
      }
  }, []);
  return (
    <div className="wrapperDiv">
      <div className="container">
        <div className="creatNewUser">
          <div>
            <h1 className="Heading">Create Mail Transporter</h1>
          </div>
          <div className="formContent">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="inputDiv">
                  <label className="form-label form-label-text">Host</label>
                  <input
                    className={error.Host ? "form-control err" : "form-control"}
                    type="text"
                    name="Host"
                    onChange={handleChange}
                    autoFocus
                  />
                  {error.Host ? <p className="errorText"><span>{error.Host}</span></p> : ""}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="inputDiv">
                    <label className="form-label form-label-text">Email Address</label>
                    <input
                      className={error.email ? "form-control err" : "form-control"}
                      type="text"
                      name="email"
                      onChange={handleChange}
                    />
                    {error.email ? <p className="errorText"><span>{error.email}</span></p> : ""}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-sm-12">
                <label className="form-label form-label-text">Port</label>
                <div className="inputDiv">
                    <input
                      className={error.port ? "form-control err" : "form-control"}
                      type="text"
                      name="port"
                      onChange={handleChange}
                    />
                    {error.port ? (
                    <p className="errorText"><span>{error.port}</span></p>
                    ) : (
                      ""
                    )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-sm-12">
                  <label className="form-label form-label-text">Password</label>
                  <div className="inputDiv input-eye-password">
                    <input
                      className={error.password ? "form-control err" : "form-control"}
                      type={icon?"text":"password"}
                      name="password"
                      onChange={handlePasswordChange}
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
                            {passwordvalidation.length ? check : cross} 16 characters minimum
                          </li>
                          <li
                            style={{
                              color: passwordvalidation.lowerCase ? "green" : "red"
                            }}
                          >
                            {passwordvalidation.lowerCase ? check : cross }  lowerCase letter
                          </li>
                        </ul>
                      )}
                  </div>
              </div>
            </div>
            <Link id="view-image-btn" className="btn btn-primary loginbtn add-new-user" onClick={!disabled ? handleSubmit: null} disabled={disabled}>
              Add a New Transporter
            </Link>

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
                <p>✓ Must be a minimum of 16 characters</p>
                <p>
                  ✓ Password should have an lowercase letter
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============= successModal ================ */}
      <div className={open ? "modal successModal open" : "modal"}>
        <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Success</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() =>  handleCloseModal()}></button>
            </div>
            <div className="modal-body">
              <p> <i className="fa-duotone fa-check"></i> &nbsp;New User Is Added</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleCloseModal()}>Close</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* =============== errorModal ================ */}
      <div className={errormessage ? "modal errorModal open" : "modal"}>
        <div className={`modal-backdrop ${open ? "active" : ""}`}></div>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Error message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setErrormessage(false)}></button>
            </div>
            <div className="modal-body">
              <p><i className="fa-regular fa-xmark"></i> &nbsp; An account with this employee ID already exists</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setErrormessage(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MailOptions;
