import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import baseURL from "../../config/default.json"

const ChangePassword = () => {
  
    const baseUrl = baseURL.baseUrl;
    const [formData,setFormData]=useState({})
    const [open,setOpen]=useState(false)
    const [error,setError]=useState({})
    const navigate=useNavigate()

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=async() =>{
       let a=validate(formData)
      setError(a)
        if(Object.keys(a).length == 0){
         await fetch(`${baseUrl}/user/changepassword`, {
                method : "POST",
                body : JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                  },
            }).then((res) => {
                setOpen(true)
                navigate("/")
              })
              .catch((err)=>console.log(err))
        }
    
      }
    
    const validate=(formData)=>{
      const errors={}
      if(!formData.email){
        errors.email="*Field is required"
       }
      else if(! (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)))
        {
          errors.email="*Invalid Email "
        }
      else if(!(formData.email.split("@")[1]=="gmail.com"))
        {
          errors.email="*Invalid Email "
        }
      else if(!((formData.email.split("@")[0]).includes(".")))
        {
          errors.email="*Invalid Email "
        } 

      if(!formData.old_password){
        errors.old_password="*Field is required"
       }

       if(!formData.new_password){
        errors.new_password="*Field is required"
       }
       else if(formData.new_password.length<8)
       {
        errors.new_password="*Password is not strong"
       }
       else{
          const test = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(formData.new_password))
          if(!test){
            errors.new_password="*Password is not strong"
          }
       }

       if(!formData.confirm_password){
        errors.confirm_password="*Field is required"
       }
      else if((formData.confirm_password != formData.new_password))
       {
        
        errors.confirm_password="*Password Doesn't Match"
       }
      return errors
    }

  return (
    <div className="maincontainer h-100">
      {/* <div className="image-div left-div"> */}
        {/* <div className="content-center h-100">
          <div className="background"></div>
        </div> */}
      {/* </div> */}
      <div className="login right-div">
        <div className="content-center h-100"> 
          <div className="form-panel">
            <div >
              <h1 className="lead text-white">Change Your Password</h1>
            </div>
            <div >
              <div className="form-Div">
                <label className="form-label">Email Address</label>
                <input className={error.email?"form-control err":"form-control"} type="text" name="email" onChange={(handleChange)} placeholder="Email Address"/>
                {error.email?<p className="errorText">{error.email}</p>:""}
              </div>
              <div className="form-Div">
                <label className="form-label">Old Password</label>
                <input className={error.old_password?"form-control err":"form-control"} type="password" name="old_password" onChange={(handleChange)} placeholder="Old Password"/>
                {error.old_password?<p className="errorText">{error.old_password}</p>:""}
              </div>
              <div className="form-Div">
                <label className="form-label">New Password</label>
                <input className={error.new_password?"form-control err":"form-control"} type="password" name="new_password" onChange={(handleChange)} placeholder="New Password"/>
                {error.new_password?<p className="errorText">{error.new_password}</p>:""}
              </div>
              <div className="form-Div">
                <label className="form-label">Confirm Password</label>
                <input className={error.confirm_password?"form-control err":"form-control"} type="password" name="confirm_password" onChange={(handleChange)} placeholder="Confirm Password"/>
                {error.confirm_password?<p className="errorText">{error.confirm_password}</p>:""}
              </div>
              <div className="text-center">
                <button type="button" className="btn btn-primary btn-submit mt-15" onClick={(handleSubmit)}>Submit</button>
              </div>
            </div>
          </div>
         </div>
      </div>
      <div  className={open?"modal open":"modal"}>

          {/* <!-- Modal content --> */}
          <div className="modal-content">
            <span className="close" onClick={()=>setOpen(false)}>&times;</span>
            <p className='modalText'>Password is change successfully</p>
          </div>

      </div>
    </div>
  
  )
}

export default ChangePassword