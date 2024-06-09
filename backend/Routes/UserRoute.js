const express = require("express");
const UserModel = require("../model/UserModel");
const authentication = require("../middlewares/Authentication");

const {
  changePassword,
  register,
  Settings,
  Delete,
  itMember,
  itMemberCount,
  singleUser,
  editUser,
  login,
  sendPasswordLink,
  forgotPasswordHandler,
  changePasswordHandler,
  sendemailtoadminandit,
  sendemailtoadminanditaboutcomment,
  sendemailtoitanduser,
  sendemailtouserandadmin,
  getuserDetails,
  deleteProfileImage,
  getUserCount,
  editprofile,
  Geteditprofile,
  getUserEmail,
  getAllUserEmails,
  getAdminEmail,
  getITEmail,
  getUsersEmail,
  getAdminEmailsForMail,
  getITEmailsForMail,
} = require("../Controller/Methods");

const userController = express.Router();

userController.post("/register", async (req, resp) => {
  register(req, resp);
});

userController.post("/settings", authentication(), async (req, resp) => {
  Settings(req, resp);
});

userController.get("/", async (req, res) => {
  const users = await UserModel.find();
  res.send(users);
});

userController.delete("/delete", authentication(), async (req, res) => {
  Delete(req, res);
});
userController.delete("/deleteProfileImage", async (req, res) => {
  deleteProfileImage(req, res);
});

userController.get("/itmember", async (req, res) => {
  itMember(req, res);
});

userController.get("/itmemberCount", async (req, res) => {
  itMemberCount(req, res);
});

userController.get("/singleuser", async (req, res) => {
  singleUser(req, res);
});

userController.put("/edit", authentication(), async (req, res) => {
  editUser(req, res);
});
userController.put("/editprofile", authentication(), async (req, res) => {
  editprofile(req, res);
});
userController.post("/login", async (req, res) => {
  login(req, res);
});

userController.post("/changepassword", async (req, resp) => {
  changePassword(req, resp);
});

userController.post("/sendpasswordlink", async (req, res) => {
  sendPasswordLink(req, res);
});

userController.post(
  "/sendemailtoadminandit",
  authentication(),
  async (req, res) => {
    sendemailtoadminandit(req, res);
  }
);

userController.post(
  "/commentdetailToAdminandIt",
  authentication(),
  async (req, res) => {
    sendemailtoadminanditaboutcomment(req, res);
  }
);

userController.post(
  "/sendemailtoitanduser",
  authentication(),
  async (req, res) => {
    sendemailtoitanduser(req, res);
  }
);

userController.post(
  "/sendemailtouserandadmin",
  authentication(),
  async (req, res) => {
    sendemailtouserandadmin(req, res);
  }
);

userController.get("/forgotpassword/:id/:token", async (req, res) => {
  forgotPasswordHandler(req, res);
});

userController.post("/:id/:token", async (req, res) => {
  changePasswordHandler(req, res);
});
userController.get("/userDetails", async (req, res) => {
  getuserDetails(req, res);
});
userController.get("/getUserCount", async (req, res) => {
  getUserCount(req, res);
});
userController.get("/getUserEmail", async (req, res) => {
  getUserEmail(req, res);
});
userController.get("/getAllAdminEmail", async (req, res) => {
  getAdminEmail(req, res);
});
userController.get("/getAllAdminEmail", async (req, res) => {
  getAdminEmail(req, res);
});
userController.get("/getAdminEmailsForMail", async (req, res) => {
  getAdminEmailsForMail(req, res);
});
userController.get("/getITEmailsForMail", async (req, res) => {
  getITEmailsForMail(req, res);
});

userController.get("/getAllITEmail", async (req, res) => {
  getITEmail(req, res);
});

userController.get("/getAllUserEmail", async (req, res) => {
  getUsersEmail(req, res);
});


userController.get("/geteditprofile", authentication(), async (req, res) => {
  Geteditprofile(req, res);
});
userController.post("/protected", authentication(), (req, res) => {
  res.status(200).json({ message: "You are authorized!" });
});
module.exports = userController;
