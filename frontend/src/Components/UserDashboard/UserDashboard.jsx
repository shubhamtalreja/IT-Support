import Navbar from "../Navigation/Navbar";
import PreviousTicket from "./PreviousTicket/PreviousTicket";
import UserTicketForm from "./UserTicketForm/UserTicketForm";
import { Routes, Route, useNavigate } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import SinglePreviousTicket from "./PreviousTicket/SinglePreviousTicket";
import UserProtectedRoute from "../ProtectedRoute/UserProtectedRoute";
import Homepage from "./Homepage/Homepage"
import Dashboard from "./Dashboard"
import ProfilePage from "../Navigation/profilepage";
import Cookies from 'js-cookie';
import CommentListContainer from "./CommentListContainer";
import Allticketuser from "./allTicketUser/allTicketUser";


const UserDashboard = () => {
  const navigate = useNavigate();

  if (!Cookies.get("token")) { 
    navigate("/");
  }
  return(
    <>
    
      <Navbar/>
      <Routes>
        <Route element={<UserProtectedRoute/>}>
        <Route path="/" element={<UserTicketForm />} />
        <Route path="/previousticket" element={<PreviousTicket />} />
        <Route path="/Homepage" element={<Homepage/>} />
        <Route path="/maindashboard" element={<Dashboard/>} />
        <Route path="/allTicketUser" element={<Allticketuser/>} />
        <Route path="/CommentListContainer" element={<CommentListContainer/>} />
        <Route path="/previousticket/ticketId/WT:ticketId" element={<SinglePreviousTicket />} />
        <Route path="/profilepage" element={<ProfilePage/>} />

        </Route>
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    
    </>
  );
};
export default UserDashboard;
