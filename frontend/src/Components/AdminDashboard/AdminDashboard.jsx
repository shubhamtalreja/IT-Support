import React, { useEffect } from "react";
import Navbar from "../Navigation/Navbar";
import EditUser from "./EditUser/EditUser";
import { NewUser } from "./NewUser/NewUser";
import AllUser from "./AllUser/AllUser";
import AllTicket from "../AllTicket/AllTicket";
import SingleTicket from "../SingleTicket/SingleTicket";
import { Routes, Route, useNavigate } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Dashboard2 from "../AdminDashboard/Dashboard2";
import ProfilePage from "../Navigation/profilepage";
import Cookies from "js-cookie";
import CommentListforAdmin from "./CommentListforAdmin";
import OpenTicket from "../OpenTicket/OpenTicket";
import CloseTicket from "../CloseTicket/CloseTicket";
import ResolveTicket from "../ResolvedTicket/ResolveTicket";
import InprogressTicket from "../InprogressTicket/InprogressTicket";
import MailOptions from "./mailOptions/mailOptions";
const AdminDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
  });

  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<NewUser />} />
          <Route path="/alluser" element={<AllUser />} />
          <Route path="/allticket" element={<AllTicket />} />
          <Route path="/maindashboard" element={<Dashboard2 />} />
          <Route
            path="/CommentListforAdmin"
            element={<CommentListforAdmin />}
          />
          <Route path="/OpenTicket" element={<OpenTicket />} />
          <Route path="/CloseTicket" element={<CloseTicket />} />
          <Route path="/ResolveTicket" element={<ResolveTicket />} />
          <Route path="/InprogressTicket" element={<InprogressTicket />} />
          <Route
            path="/allticket/ticketId/WT:ticketId"
            element={<SingleTicket />}
          />
          <Route path="/alluser/:employeeID" element={<EditUser />} />
          <Route path="/MailOptions" element={<MailOptions />} />
          <Route path="/profilepage" element={<ProfilePage />} />-{" "}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default AdminDashboard;
