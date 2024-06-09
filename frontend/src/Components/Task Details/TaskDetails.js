import React from "react";

const TaskDetails = ({
  ticket,
  item,
  assigneeName,
  handleChangeAssignee,
  assignee,
  defaultValue,
  handleStatusChange,
  selectedValue,
  handleBothClick,
  statusSelected,
  assigneeSelected,
  selectedAssignee,
  role,
  changeTicketStatusHandler,
}) => {
  return (
    <div>
      <div className="details-box">
        <div className="Heading">Task Assignee Details</div>
        <ul className="assineeDetails">
          <li>
            <span className="btext">Assignee: </span>
            <span className="tickettext">
              {item.assignee?.name ? item.assignee?.name : "IT Members"}
            </span>
          </li>
          <li>
            <span className="btext">
              <i className="fa-regular fa-user"></i>&nbsp;Raise By:
            </span>
            <span className="tickettext">
              {ticket[0]?.ticketform?.reporter
                ? ticket[0]?.ticketform?.reporter
                : "-"}
            </span>
          </li>
          <li>
            <span className="btext">Priority: </span>
            <span className="tickettext">{item.ticketform.priority}</span>
          </li>
          <li>
            <span className="btext">Assignee To: </span>
            <span className="tickettext">
              {item.assignee?.name ? item.assignee?.name : selectedAssignee}
            </span>
          </li>
          <li>
            <span className="btext">Status: </span>
            <span className="tickettext">{item.status}</span>
          </li>
        </ul>
      </div>
      {role !== "user" ? (
        <>
          {" "}
          <div className="selectionForm">
            <div className="selectDiv mb-20">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Assignee To:-
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="assignee"
                onChange={handleChangeAssignee}
                placeholder="Priority"
              >
                <option value="">{defaultValue}</option>
                {assignee.length > 0
                  ? assignee?.map((item, index) => (
                      <option key={index} value={item.employeeID}>
                        {item.name}
                      </option>
                    ))
                  : []}
              </select>
            </div>
            <div className="selectDiv mb-20">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Change Status:-
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="status"
                value={selectedValue}
                onChange={handleStatusChange}
                placeholder="Priority"
              >
                <option value="">{defaultValue}</option>
                <option value="Open">Open</option>
                <option value="Close">Close</option>
                <option value="Resolve">Resolve</option>
                <option value="In progress">In progress...</option>
              </select>
            </div>
            <div className="text-right">
              <button
                className="btn btn-primary"
                onClick={handleBothClick}
                disabled={!statusSelected && !assigneeSelected}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {role === "user" && item.status === "Resolve" ? (
        <>
          {" "}
          <div className="selectDiv mb-20">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Change Status:-
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="status"
              value={selectedValue}
              onChange={handleStatusChange}
              placeholder="Priority"
            >
              <option value="Close">Close</option>
            </select>
          </div>
          <div className="text-right">
            <button
              className="btn btn-primary"
              onClick={changeTicketStatusHandler}
              // disabled={!statusSelected}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default TaskDetails;
