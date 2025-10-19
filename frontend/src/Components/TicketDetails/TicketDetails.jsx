
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TicketDetails = ({ item, images, handleImageLink, handlepdfLink }) => {
  const [imageOpen, setImageOpen] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(null);

  const handleCloseModals = () => {
    setImageOpen(null);
    setPdfOpen(null);
  };

  return (
    <div>
      <h4 className="bText">
        Title:- <span className="spanText">{item.ticketform.title}</span>
      </h4>
      <h4 className="bText" style={{ wordBreak: "break-all" }}>
        Description:-{" "}
        <span className="spanText">{item.ticketform.description}</span>
      </h4>

      {/* View Image Button */}
      <div className="mt-15">
        {images?.length > 0 && images ? (
          <Link
            className="btn btn-primary not-allowed"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            View Image
          </Link>
        ) : (
          <Link
            id="view-image-btn"
            className="btn btn-primary not-allowed"
            disabled
          >
            View Image
          </Link>
        )}

        {/* View Image modal */}
        <div
          className="modal fade ticket-Image-modal "
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Images/Pdf
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="ticketbox">
                  {images ? (
                    <div>
                      {images?.map((item, index) => (
                        <React.Fragment key={index}>
                          {item.split(".").pop() === "pdf" ? (
                            <div className="ticket-image">
                              <div className="image">
                                <img
                                  src={
                                    "https://www.freeiconspng.com/thumbs/pdf-icon-png/pdf-icon-png-pdf-zum-download-2.png"
                                  }
                                  alt=""
                                  className="ticket_image_thumbnail"
                                ></img>
                              </div>
                              <Link
                                className="image_Link"
                                onClick={() => handlepdfLink(index)}
                              >
                                pdf link
                              </Link>
                            </div>
                          ) : (
                            <div className="ticket-image">
                              <div className="image">
                                <img
                                  src={item}
                                  alt=""
                                  className="ticket_image_thumbnail"
                                ></img>
                              </div>
                              <Link
                                className="image_Link"
                                onClick={() => handleImageLink(index)}
                              >
                                Image link
                              </Link>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* View Image modal End */}
      </div>

      {images &&
        images.map((item, index) => (
          <>
            {["jpg", "png", "jpeg"].includes(item.split(".").pop()) && (
              <div
                className={
                  imageOpen === index ? "modal imagemodal open" : "modal"
                }
                key={index}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Images</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => handleCloseModals()}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="ticket-image">
                        <div className="image-modal">
                          <img src={item} alt=""></img>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => handleCloseModals()}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {item.split(".").pop() === "pdf" && (
              <div
                className={
                  pdfOpen === index ? "modal imagemodal open" : "modal"
                }
                key={index}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Pdf</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => handleCloseModals()}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="ticket-image">
                        <iframe
                          src={item}
                          width="100%"
                          height="500px"
                          title="PDF Viewer"
                        ></iframe>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => handleCloseModals()}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ))}
    </div>
  );
};

export default TicketDetails;