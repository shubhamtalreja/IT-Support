import React from "react";
import Accordion from "react-bootstrap/Accordion";
export default function CustomComponentForComments({
  data,
  renderItem,
  noDataMessage,
}) {
  return (
    <>
      <Accordion defaultActiveKey="0" className="treviewaccordion">
        {data && data.length > 0 ? (
          data.map((item) => (
            <Accordion.Item eventKey={item.ticketId} key={item.ticketId}>
              <Accordion.Header className="justify-content-between">
                <p className="commentTicketId">Ticket ID: {item.ticketId}</p>
                <div className=""></div>
              </Accordion.Header>
              {item.comment.length !== 0 ? (
                item.comment.map((comment, subIndex) => (
                  <Accordion.Body key={comment._id}>
                    {renderItem(comment)}
                  </Accordion.Body>
                ))
              ) : (
                <Accordion.Body>{noDataMessage}</Accordion.Body>
              )}
            </Accordion.Item>
          ))
        ) : (
          <Accordion.Item eventKey="0">
            <Accordion.Header>{noDataMessage}</Accordion.Header>
          </Accordion.Item>
        )}
      </Accordion>
    </>
  );
}
