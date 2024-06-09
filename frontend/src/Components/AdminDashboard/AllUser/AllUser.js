import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../../../config/default.json";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const AllUser = () => {
  const baseUrl = baseURL.baseUrl;
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [a, setA] = useState(false);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userIt, setUserIt] = useState();
  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken;
  const loggedInAdmin = user.employeeID;
  const accept = (id) => {
    handleDelete(id);
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "Deleted",
      life: 3000,
    });
  };

  const confirm2 = (id) => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => accept(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/user/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await response.json();
      setA(!a);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${baseUrl}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const data = await response.json();

        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData1 = async () => {
      if (decodedToken.role === "it") {
        try {
          setLoading(true);

          const response = await fetch(`${baseUrl}/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
          const data = await response.json();
          const filteredData = data.filter((item) => item.role === "it");
          setUserIt(filteredData);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
    fetchData1();
  }, [a]);

  return (
    <div className="wrapperDiv previousTickits">
      <div className="container">
        <div className="Heading">All User</div>
        <div className="table-responsive">
          <Toast ref={toast} position="bottom-left" />

          <ConfirmDialog accept={() => accept} />

          {loading ? (
            <div
              className="spinner-border text-danger"
              role="status"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <table className="table table-bordered common-Table">
              {decodedToken.role === "it" ? (
                <thead className="Heading">
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                  </tr>
                </thead>
              ) : (
                <thead className="Heading">
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Delete/Edit</th>
                  </tr>
                </thead>
              )}
              {decodedToken.role === "it" ? (
                <tbody>
                  {userIt?.map((item) => (
                    <tr key={item._id}>
                      <td className="view-column">{item.employeeID}</td>
                      <td className="view-column">{item.name}</td>
                      <td className="view-column">{item.role}</td>
                      <td className="view-column">{item.email}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  {users?.map((item) => (
                    <tr key={item._id}>
                      <td className="view-column">{item.employeeID}</td>
                      <td className="view-column">{item.name}</td>
                      <td className="view-column">{item.role}</td>
                      <td className="view-column">{item.email}</td>
                      <td className="view-column">
                        <button
                          className="edit"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/alluser/${item.employeeID}`
                            )
                          }
                        >
                          Edit
                        </button>
                        {loggedInAdmin === item.employeeID ? (
                          <button className="delete" disabled>
                            Delete
                          </button>
                        ) : (
                          <button
                            className="delete"
                            onClick={() => confirm2(item._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUser;
