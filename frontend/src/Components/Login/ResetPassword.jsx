import React, { useState,useEffect,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from "../../config/default.json"

const ResetPassword = () => {

    const baseUrl = baseURL.baseUrl;
    const [email, setEmail] = useState();
    const [message, setMessage] = useState();
    const [firstTime, setFirstTime] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const[open,setOpen]=useState(false);
    const navigate=useNavigate();
    const submitButtonRef = useRef(null);
    const errors = {};

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
    
    const validate = (payload) => {
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
        if (Object.keys(errors).length == 0) {
          setDisabled(false);
        }
        setError(errors);
        return errors;
      };

      useEffect(() => {
        if (!firstTime) {
          validate({email});
        }
        setFirstTime(false);
      }, [email])

      const handleModalOpen= async()=>{
        const payload = {
          email,
          url: window.location.origin
        };
        const validationErrors = validate(payload);
        setError(validationErrors);
        if (Object.keys(validationErrors).length == 0) {
          setLoading(true);
          try {
            const response = await fetch(`${baseUrl}/user/sendpasswordlink`, {
              method: "POST",
              body: JSON.stringify(payload),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if(response.ok){
              setEmail("");
              setMessage(true);
              setOpen(true);
            }
            else{
            setError({ email: "Invalid credentials" });
          }
          setLoading(false);
          } catch (error) {
            console.log(error);
          }
        }
      }
      const handleModalClose=()=>{
        setOpen(false);
        navigate('/')
      }

    return (
      <div className="maincontainer h-100">
      {/* <div className="image-div left-div">
        <div className="content-center h-100">
          <div className="background"></div>
        </div>
      </div> */}
      <div className="login right-div">

        <div className="wrapperDiv">
            <div className="container">
              <div className=" resetPassword">
                <div>
                    <h2 className="Heading">Enter your Email</h2>
                </div>
                <div className="formContent">
                    <div className="row mb-20">
                        <div className="col-md-12 col-sm-12">
                            <label className="form-label form-label-text">Email</label>
                            <input 
                             className={error.email ? "form-control err" : "form-control"} type="email" onChange={(e) => setEmail(e.target.value)} autoFocus/>
                              {error.email ? <p className="errorText">{error.email}</p> : ""}
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <button className="btn btn-primary" onClick={()=>handleModalOpen()} disabled={disabled} ref={submitButtonRef}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          
          {/* Modal Start */}
          {loading ? (
          <div className="spinner-border text-danger"
          role="status"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%'
         }}
         >
          <span className="visually-hidden">Loading...</span>
          </div>
          ) : (
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
                  onClick={() => handleModalClose()}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0"><i className="fa-sharp fa-regular fa-circle-check"></i> &nbsp;
                  Your password reset link has been sent to your email
                  successfully
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => handleModalClose()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          
        {/* Modal End */}
      </div>
      </div>
    </div>
    );
};


export default ResetPassword