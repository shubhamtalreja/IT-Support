import "./commentBox.css";
import { AiOutlineDelete } from "react-icons/ai";

const CommentBox = ({
  currentComments,
  handleChange,
  value,
  handleComment,
  handleClick,
  handlePrevPage,
  handleNextPage,
  currentPage,
  totalPages,
  role,
  deleteCommentHandler,
}) => {
  return (
    <div className="commentbox mt-30 mb-30">
      <h4 className="commentheading">Comments</h4>
      <div className="inputbox">
        <textarea
          className="form-control textareaInput mb-20"
          type="text"
          name="comment"
          onChange={handleChange}
          placeholder="Add a comment"
          value={value}
        />
        <div className="text-right">
          <button
            className="btn btn-primary comment-button"
            onClick={handleComment}
          >
            Submit
          </button>
          <button
            className="btn btn-primary ml-10 comment-button"
            onClick={handleClick}
          >
            Cancel
          </button>
        </div>
      </div>
      {currentComments?.map((item, index) => {
        return (
          <CommentDetail
            key={index}
            item={item}
            role={role}
            deleteCommentHandler={deleteCommentHandler}
          />
        );
      })}
      {totalPages > 1 && (
        <div className="pagination-container mt-3">
          <button
            className="btn btn-custom"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Comments {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-custom"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const CommentDetail = ({ item, deleteCommentHandler, role }) => {
  return (
    <div>
      <div className="commentdetail">
        <div className="row">
          <div className="commentdetail col-md-10 order-md-1 mb-3">
            <p className="cText">
              <span className="cName">{item.commentedBy}&nbsp;:-</span> Replied
            </p>
            <p className="cText cComnt">
              <span>{item.comment}</span>
            </p>
            <p className="cText cComnt">
              <span className="cmnt-ON">Commented on : </span>
              &nbsp;<span className="cdate">{item.time}</span>,&nbsp;
              <span className="ctime">{item.date}</span>
              {role === "admin" && (
                <button
                  onClick={() => deleteCommentHandler(item.commentId)}
                  className="deleteButton"
                >
                  <AiOutlineDelete style={{ color: "red" }} />
                </button>
              )}
            </p>
            <hr></hr>
          </div>
          <div className="col-md-2 order-md-2"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
