import React, { useState, useEffect } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosConfig.js";
import toast from "react-hot-toast";



const Update = () => {
  const employees = {
    firstName: "",
    secondtName: "",
    email: "",
    department: "",
    salary: "",
  };
  const [employee, setEmployee] = useState(employees);
  const navigate = useNavigate();
  const {id} = useParams();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setEmployee({ ...employee, [name]: value });
  };

  useEffect(() => {
    api
      .get(`/employees/${id}`)
      .then((response) => {
        setEmployee(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error loading employee data", { position: "top-right" });
      });
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    
    // Convert salary to number
    const employeeData = {
      ...employee,
      salary: Number(employee.salary)
    };
    
    await api
      .put(`/employees/${id}`, employeeData)
      .then((response) => {
        toast.success("Employee updated successfully!", { position: "top-right" });
        navigate("/employee");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message || "Error updating employee", { position: "top-right" });
      });
  };

  return (
    <div className="addEmployee">
      <Link to="/employee" type="button" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Update Employee</h3>
      <form className="addEmployeeForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="name"
            onChange={inputHandler}
            name="firstName"
            value={employee.firstName}
            autoComplete="off"
            placeholder="Enter your FirstName"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="secondtName"
            onChange={inputHandler}
            name="secondtName"
            value={employee.secondtName}
            autoComplete="off"
            placeholder="Enter your LastName"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            onChange={inputHandler}
            name="email"
            value={employee.email}
            autoComplete="off"
            placeholder="Enter your Email"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            onChange={inputHandler}
            name="department"
            value={employee.department}
            autoComplete="off"
            placeholder="Enter your Department"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="salary">Salary:</label>
          <input
            type="text"
            id="salary"
            onChange={inputHandler}
            name="salary"
            value={employee.salary}
            autoComplete="off"
            placeholder="Enter your Salary"
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update;