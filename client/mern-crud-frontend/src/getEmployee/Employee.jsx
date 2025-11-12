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
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const userIsAdmin = isAdmin(); 

  const fetchData = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };
  
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.log("Error while fetching user data", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUser();
    
    // Проверяваме дали има session_id в URL (връщане от плащане)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      // Премахваме session_id от URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Рефрешваме данните
      setTimeout(() => {
        fetchData();
        fetchUser();
      }, 1000);
    }
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

  const handleCheckout = async () => {
    setProcessingPayment(true);
    try {
      const response = await api.post("/payment/create-checkout-session");
      
      if (response.data.url) {
        // Пренасочваме към Stripe Checkout
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create checkout session");
        setProcessingPayment(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setProcessingPayment(false);
    }
  };

  // Показваме upgrade banner само за обикновени потребители, които не са платили
  const showUpgradeBanner = !userIsAdmin && user && !user.isPaid;

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
              onClick={() => handleSort('secondName', (employee) => employee.secondName)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Second Name
              {renderSortIcon('secondName')}
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
              onClick={() => handleSort('kudos', (employee) => employee.kudos || 0, 'number')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Kudos
              {renderSortIcon('kudos')}
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
                <td>{Employee.secondName}</td>
                <td>{Employee.email}</td>
                <td>{Employee.department}</td>
                <td>{Employee.salary}</td>
                <td>{Employee.kudos}</td>
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

      {showUpgradeBanner && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            🔒 Limited Access
          </h3>
          <p style={{ margin: '0 0 15px 0', opacity: 0.9 }}>
            You're viewing only the first 2 employee records. Upgrade to Premium to unlock full access to all employees!
          </p>
          <button
            onClick={handleCheckout}
            disabled={processingPayment}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: processingPayment ? 'not-allowed' : 'pointer',
              opacity: processingPayment ? 0.6 : 1
            }}
          >
            {processingPayment ? 'Processing...' : '🚀 Upgrade to Premium - $10.00'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Employee;