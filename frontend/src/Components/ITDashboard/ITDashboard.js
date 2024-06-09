import React from "react";
import { Routes, Route } from "react-router-dom";
import AllTicket from "../AllTicket/AllTicket";
import Navbar from "../Navigation/Navbar";
import SingleTicket from "../SingleTicket/SingleTicket";
import PageNotFound from "../PageNotFound";
import ItProtectedRoute from "../ProtectedRoute/ItProtectedRoute";
import Dashboard3 from "./Dashboard3";
import NewTicket from "./NewTicket/NewTicket";
import ProfilePage from "../Navigation/profilepage";
import CommentListforIt from "./CommentListforIt";
import AllTicketforIt from "../AllTicketsforIt/AllTicketforIt";
import OpenTicket from "../OpenTicket/OpenTicket";
import CloseTicket from "../CloseTicket/CloseTicket";
import ResolveTicket from "../ResolvedTicket/ResolveTicket";
import InprogressTicket from "../InprogressTicket/InprogressTicket";
import AllUser from "../AdminDashboard/AllUser/AllUser";

const ITDashboard = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route element={<ItProtectedRoute />}>
          <Route path="/" element={<AllTicket />} />
          <Route path="/NewTicket" element={<NewTicket />} />
          <Route path="ticketId/WT:ticketId" element={<SingleTicket />} />
          <Route path="/maindashboard" element={<Dashboard3 />} />
          <Route path="/CommentListforIt" element={<CommentListforIt />} />
          <Route path="/AllTicketforIt" element={<AllTicketforIt />} />
          <Route path="/OpenTicket" element={<OpenTicket />} />
          <Route path="/CloseTicket" element={<CloseTicket />} />
          <Route path="/ResolveTicket" element={<ResolveTicket />} />
          <Route path="/InprogressTicket" element={<InprogressTicket />} />
          <Route path="/alluser" element={<AllUser />} />
          <Route path="/profilepage" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default ITDashboard;
