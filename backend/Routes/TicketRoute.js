const express = require("express");
const multer = require("multer");
const ticketController = express.Router();
const {
  create,
  postTicket,
  getComment,
  getallDataofCommentsforItandAdmin,
  userSingleTicket,
  postComment,
  getTicket,
  getUserTicket,
  getSingleTicket,
  getImages,
  getCount,
  postImage,
  getProfileImages,
  updateTicket,
  getCount_Basis_On_EmployeeID,
  getCount_Basis_On_status,
  getCount_Basis_On_Status_notEqauls_Resolve,
  getTotalComments,
  getTotalCommentsBasedOnEmployeeId,
  getallDataofCommentsBasedOnEmployeeId,
  getCount_Basis_On_status_Open,
  getCount_Basis_On_status_Close,
  getCount_Basis_On_status_Resolve,
  getCount_Basis_On_status_Inprogress,
  getUserTicketClose,
  getTicketClose,
  getTicketResolve,
  getTicketInProgress,
  getProfileImages_for_Avatar,
  getTotalCountsofComments,
  getTicketOpen,
  getUserInprogressTicket,
  postCommentOnTicket,
  exportTicketsToExcel,
  downloadExcel,
  deleteComment,
  deleteCommentOnTicket,
  getUserTicketResolve,
  getUserTicketCountOnBasisOfResolve,
} = require("../Controller/Methods");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

ticketController.post("/create", upload.single("images"), async (req, res) => {
  create(req, res);
});

ticketController.post(
  "/profileimage",
  upload.single("files"),
  async (req, res) => {
    postImage(req, res);
  }
);

ticketController.post(
  "/ticket",
  upload.array("files", 10),
  async (req, res) => {
    postTicket(req, res);
  }
);

ticketController.put("/update", async (req, res) => {
  updateTicket(req, res);
});

ticketController.get("/comment", async (req, res) => {
  getComment(req, res);
});

ticketController.get("/commentforItandAdmin", async (req, res) => {
  getallDataofCommentsforItandAdmin(req, res);
});
ticketController.get("/TotalComments", async (req, res) => {
  getTotalCountsofComments(req, res);
});

ticketController.get("/usersingleticket", async (req, res) => {
  userSingleTicket(req, res);
});

ticketController.post("/comment", async (req, res) => {
  postComment(req, res);
});
ticketController.post("/commentOnTicket", async (req, res) => {
  postCommentOnTicket(req, res);
});
ticketController.delete("/deleteCommentOnTicket", async (req, res) => {
  deleteCommentOnTicket(req, res);
});
ticketController.get("/ticket", async (req, res) => {
  getTicket(req, res);
});

ticketController.get("/userticket", async (req, res) => {
  getUserTicket(req, res);
});

ticketController.get("/singleticket/", async (req, res) => {
  getSingleTicket(req, res);
});

ticketController.get("/images", async (req, res) => {
  getImages(req, res);
});
ticketController.get("/getProfileImages", async (req, res) => {
  getProfileImages(req, res);
});

ticketController.get("/ticketcount", async (req, res) => {
  getCount(req, res);
});
ticketController.get("/ticketcountOnEmployeeID", async (req, res) => {
  getCount_Basis_On_EmployeeID(req, res);
});
ticketController.get("/ticketcountOnstatus", async (req, res) => {
  getCount_Basis_On_status(req, res);
});
ticketController.get("/ticketcountOnstatusOpen", async (req, res) => {
  getCount_Basis_On_status_Open(req, res);
});

ticketController.get("/ticketcountOnstatusClose", async (req, res) => {
  getCount_Basis_On_status_Close(req, res);
});

ticketController.get("/userTicketCountOnBasisOfResolve", async (req, res) => {
  getUserTicketCountOnBasisOfResolve(req, res);
});

ticketController.get("/ticketcountOnstatusResolve", async (req, res) => {
  getCount_Basis_On_status_Resolve(req, res);
});

ticketController.get("/ticketcountOnstatusInprogress", async (req, res) => {
  getCount_Basis_On_status_Inprogress(req, res);
});

ticketController.get("/ticketcountOnstatusnotResolve", async (req, res) => {
  getCount_Basis_On_Status_notEqauls_Resolve(req, res);
});

ticketController.get("/totalcomment", async (req, res) => {
  getTotalComments(req, res);
});

ticketController.get("/totalcommentBasedonEmployeeId", async (req, res) => {
  getTotalCommentsBasedOnEmployeeId(req, res);
});

ticketController.get("/datacommentBasedonEmployeeId", async (req, res) => {
  getallDataofCommentsBasedOnEmployeeId(req, res);
});
ticketController.delete("/deleteComment", async (req, res) => {
  deleteComment(req, res);
});
ticketController.get("/ticketClose", async (req, res) => {
  getTicketClose(req, res);
});
ticketController.get("/ticketResolve", async (req, res) => {
  getTicketResolve(req, res);
});
ticketController.get("/ticketOpen", async (req, res) => {
  getTicketOpen(req, res);
});
ticketController.get("/ticketInProgress", async (req, res) => {
  getTicketInProgress(req, res);
});
ticketController.get("/userTicketClose", async (req, res) => {
  getUserTicketClose(req, res);
});
ticketController.get("/userTicketInprogress", async (req, res) => {
  getUserInprogressTicket(req, res);
});
ticketController.get("/userTicketResolve", async (req, res) => {
  getUserTicketResolve(req, res);
});

ticketController.get("/exportTicketsToExcel", async (req, res) => {
  exportTicketsToExcel(req, res);
});
ticketController.post("/downloadExcel", async (req, res) => {
  downloadExcel(req, res);
});
ticketController.get("/getimageavatar", (req, res) => {
  getProfileImages_for_Avatar(req, res);
});

module.exports = ticketController;
