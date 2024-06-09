import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";
import baseURL from "../../config/default.json";
import "./commetList.css";
import CustomComponentForComments from "../CustomComponentsForComments/CustomComponentForComments";
export default function CommentListforIt() {
  const baseUrl = baseURL.baseUrl;
  const [getTotalCommentDataForIT, setTotalCommentDataForIT] = useState([]);
  const [commentDataforIT, setCommentDataforIT] = useState();
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

        setCommentDataforIT(data?.commentData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (getTotalCommentDataForIT) {
      setCommentDataforIT(getTotalCommentDataForIT);
    }
  }, [getTotalCommentDataForIT]);
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
          <h2 className="Heading">Comments For IT</h2>{" "}
        </div>
        <CustomComponentForComments
          data={commentDataforIT}
          renderItem={renderItem}
          noDataMessage="No comments available"
        />
      
      </div>
    </div>
  );
}
