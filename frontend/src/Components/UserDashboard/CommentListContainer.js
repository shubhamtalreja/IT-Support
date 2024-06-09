import React, { useEffect, useState } from "react";
import baseURL from "../../config/default.json";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import CustomComponentForComments from "../CustomComponentsForComments/CustomComponentForComments";

const CommentListContainer = () => {
  const baseUrl = baseURL.baseUrl;
  const [totalCommentData, setTotalCommentData] = useState(null);
  const [commentData, setCommentData] = useState(null);

  const user = {
    employeeID: jwt_decode(Cookies.get("token")).employeeID,
  };

  const employeeId = user.employeeID;

  const fetchData4 = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/ticket/datacommentBasedonEmployeeId?employeeId=${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      setTotalCommentData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData4();
  }, []);

  useEffect(() => {
    if (totalCommentData) {
      setCommentData(totalCommentData.commentData);
    }
  }, [totalCommentData]);

   const renderItem = (comment) => (
     <div className="d-flex justify-content-between align-items-center">
       <div className="row">
         <p className="commentText">
           <span className="font-weight-bold">Comment:</span>
           {comment?.comment}
         </p>
         <p className="commentBy">
           <span className="font-weight-bold">Commented By:</span>
           {comment?.commentedBy}
         </p>
         <p className="commentDate">
           <span className="font-weight-bold">Commented On:</span>
           {comment?.date}
         </p>
       </div>
     </div>
   );

  return (
    <div className="wrapperDiv">
      <div className="container">
        <div>
          <h2 className="Heading">User Comments</h2>
        </div>
        <CustomComponentForComments
          data={commentData}
          renderItem={renderItem}
          noDataMessage="No comments available"
        />
        {/* <Accordion defaultActiveKey="0" className="treviewaccordion">
          {commentData && commentData.length > 0 ? (
            commentData.map((commentItem) => (
              <Accordion.Item
                eventKey={commentItem.ticketId.toString()} // Convert ticketId to string
                key={commentItem.ticketId}
              >
                <Accordion.Header className="justify-content-between">
                  <p className="commentTicketId">
                    Ticket ID: {commentItem.ticketId}{" "}
                  </p>
                  <div className=""></div>
                </Accordion.Header>
                {commentItem.comment.length !== 0 ? (
                  commentItem.comment.map((comment, subIndex) => (
                    <Accordion.Body key={comment._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="row">
                          <p className="commentText">
                            <span className="font-weight-bold">Comment:</span>
                            {comment?.comment}
                          </p>
                          <p className="commentBy">
                            <span className="font-weight-bold">
                              Commented By:
                            </span>
                            {comment?.commentedBy}
                          </p>
                          <p className="commentDate">
                            <span className="font-weight-bold">
                              Commented On:
                            </span>
                            {comment?.date}
                          </p>
                        </div>
                      </div>
                      <hr />
                    </Accordion.Body>
                  ))
                ) : (
                  <Accordion.Body>no comments available</Accordion.Body>
                )}
              </Accordion.Item>
            ))
          ) : (
            <Accordion.Item eventKey="0">
              <Accordion.Header>no list available</Accordion.Header>
            </Accordion.Item>
          )}
        </Accordion> */}
      </div>
    </div>
  );
};

export default CommentListContainer;
