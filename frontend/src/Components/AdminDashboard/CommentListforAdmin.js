import React, { useEffect, useState } from "react";
import baseURL from "../../config/default.json";
import Cookies from "js-cookie";
import { Chart, registerables } from "chart.js";
import CustomComponentForComments from "../CustomComponentsForComments/CustomComponentForComments";
Chart.register(...registerables);

const CommentListforAdmin = () => {
  const baseUrl = baseURL.baseUrl;
  const [totalCommentDataForAdmin, setTotalCommentDataForAdmin] =
    useState(null);
  const [commentDataForAdmin, setCommentDataForAdmin] = useState([]);
  const [commentData, setCommentData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/ticket/commentforItandAdmin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await response.json();
        setTotalCommentDataForAdmin(data);
        setCommentData(data?.commentData[0]?.comment);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (totalCommentDataForAdmin) {
      setCommentDataForAdmin(totalCommentDataForAdmin.commentData);
    }
  }, [totalCommentDataForAdmin]);
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
    <>
      <div className="wrapperDiv">
        <div className="container">
          <div>
            <h2 className="Heading">Comments</h2>
          </div>
          <CustomComponentForComments
            data={commentDataForAdmin}
            renderItem={renderItem}
            noDataMessage="No comments available"
          />
          {/* <Accordion defaultActiveKey="0" className="treviewaccordion">
            {commentDataForAdmin && commentDataForAdmin.length > 0 ? (
              commentDataForAdmin.map((commentItem) => (
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
    </>
  );
};

export default CommentListforAdmin;
