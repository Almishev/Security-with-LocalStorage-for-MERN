import React, { useEffect, useState } from "react";
import "./employee.css";
import api from "../utils/axiosConfig.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { removeToken, isAdmin } from "../utils/auth.js";
import { formatDate } from "../utils/dateIsoConfig.js";


const Employee = () => {
  const [Employees, setEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({ column: null, direction: null });
  const navigate = useNavigate();
  const userIsAdmin = isAdmin(); 

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

  const handleSort = (column, accessor, type = 'string') => {
    let direction = 'asc';

    if (sortConfig.column === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedEmployees = [...Employees].sort((a, b) => {
      let aValue = accessor(a);
      let bValue = accessor(b);

      if (type === 'number') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (type === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      aValue = (aValue ?? '').toString().toLowerCase();
      bValue = (bValue ?? '').toString().toLowerCase();
      return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    setEmployees(sortedEmployees);
    setSortConfig({ column, direction });
  };

  const renderSortIcon = (column) => {
    if (sortConfig.column !== column) {
      return <i className="fa-solid fa-arrows-up-down" style={{ marginLeft: '8px', opacity: 0.5 }}></i>;
    }

    if (sortConfig.direction === 'asc') {
      return <i className="fa-solid fa-arrow-up" style={{ marginLeft: '8px' }}></i>;
    }

    return <i className="fa-solid fa-arrow-down" style={{ marginLeft: '8px' }}></i>;
  };

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
       {userIsAdmin && (
        <Link to="/add" type="button" className="btn btn-primary">
          Add Employee <i className="fa-solid fa-Employee-plus"></i>
        </Link>
       )}
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
            <th
              scope="col"
              onClick={() => handleSort('firstName', (employee) => employee.firstName)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              First Name
              {renderSortIcon('firstName')}
            </th>
            <th
              scope="col"
              onClick={() => handleSort('secondtName', (employee) => employee.secondtName)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Second Name
              {renderSortIcon('secondtName')}
            </th>
            <th
              scope="col"
              onClick={() => handleSort('email', (employee) => employee.email)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Email
              {renderSortIcon('email')}
            </th>
            <th
              scope="col"
              onClick={() => handleSort('department', (employee) => employee.department)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Departament
              {renderSortIcon('department')}
            </th>
            <th
              scope="col"
              onClick={() => handleSort('salary', (employee) => employee.salary, 'number')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Salary
              {renderSortIcon('salary')}
            </th>
            <th
              scope="col"
              onClick={() => handleSort('createdAt', (employee) => employee.createdAt, 'date')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Date of Entry
              {renderSortIcon('createdAt')}
            </th>
            {userIsAdmin && (
            <th scope="col">Actions</th>
            )}
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
                <td>{formatDate(Employee.createdAt)}</td>
                {userIsAdmin && (
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
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;