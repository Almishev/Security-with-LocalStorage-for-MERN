import React, { useState } from "react";
import "./addEmployee.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig.js";
import toast from "react-hot-toast";

const AddEmployee = () => {
  const employees = {
    firstName: "",
    secondName: "",
    email: "",
    department: "",
    salary: "",
  };
  const [employee, setEmployee] = useState(employees);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setEmployee({ ...employee, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    // Convert salary to number
    const employeeData = {
      ...employee,
      salary: Number(employee.salary)
    };
    
    await api
      .post("/employees", employeeData)
      .then((response) => {
        toast.success("Employee added successfully!", { position: "top-right" });
        navigate("/employee");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message || "Error adding employee", { position: "top-right" });
      });
  };

  return (
    <div className="addEmployee">
      <Link to="/employee" type="button" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Add New Employee</h3>
      <form className="addEmployeeForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="name"
            onChange={inputHandler}
            name="firstName"
            autoComplete="off"
            placeholder="Enter your FirstName"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="firstName">Last Name:</label>
          <input
            type="text"
            id="secondName"
            onChange={inputHandler}
            name="secondName"
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
            autoComplete="off"
            placeholder="Enter your Email"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="firstName">Department:</label>
          <input
            type="text"
            id="department"
            onChange={inputHandler}
            name="department"
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

export default AddEmployee;