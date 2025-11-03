import React, { useEffect, useState } from "react";
import "./employee.css";
import api from "../utils/axiosConfig.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { removeToken } from "../utils/auth.js";

const Employee = () => {
  const [Employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const deleteEmployee = async (EmployeeId) => {
    await api
      .delete(`/employees/${EmployeeId}`)
      .then((response) => {
        setEmployees((prevEmployee) => prevEmployee.filter((Employee) => Employee._id !== EmployeeId));
        toast.success(response.data.message, { position: "top-right" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully!", { position: "top-right" });
    navigate("/login");
  };

  return (
    <div className="employeeTable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/add" type="button" className="btn btn-primary">
          Add Employee <i className="fa-solid fa-Employee-plus"></i>
        </Link>
        <Link to="/profile" type="button" className="btn btn-info">
          Profile <i className="fa-solid fa-user"></i>
        </Link>
        <button 
          onClick={handleLogout} 
          type="button" 
          className="btn btn-warning"
          style={{ marginLeft: '10px' }}
        >
          <i className="fa-solid fa-sign-out-alt"></i> Log Out
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">First Name</th>
            <th scope="col">Second Name</th>
            <th scope="col">Email</th>
            <th scope="col">Departament</th>
            <th scope="col">Salary</th>
            <th scope="col">Date of Entry</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Employees.map((Employee, index) => {
            return (
              <tr key={Employee._id}>
                <td>{index + 1}</td>
                <td>{Employee.firstName}</td>
                <td>{Employee.secondtName}</td>
                <td>{Employee.email}</td>
                <td>{Employee.department}</td>
                <td>{Employee.salary}</td>
                <td>{Employee.createdAt}</td>
                
                <td className="actionButtons">
                  <Link
                    to={`/update/` + Employee._id}
                    type="button"
                    className="btn btn-info"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>

                  <button
                    onClick={() => deleteEmployee(Employee._id)}
                    type="button"
                    className="btn btn-danger"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;