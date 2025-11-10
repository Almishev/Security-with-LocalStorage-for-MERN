import Employee from "./getEmployee/Employee.jsx"
import AddEmployee from "./addEmployee/AddEmployee.jsx";
import Update from "./updateuser/Update.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Profile from "./profile/Profile.jsx";
import PaymentSuccess from "./payment/PaymentSuccess.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"


function App() {
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <Employee />
      </ProtectedRoute>
    ),
  },
  {

    path: "/add",
    element: (
      <AdminRoute>
        <AddEmployee />
      </AdminRoute>
    ),
  },
  {
    path: "/update/:id",
    element: (
      <AdminRoute>
        <Update />
      </AdminRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-success",
    element: (
      <ProtectedRoute>
        <PaymentSuccess />
      </ProtectedRoute>
    ),
  },
 

]);
  return (
    <>
     <RouterProvider router={router} />
     <Toaster position="top-right" />
    </>
  )
}

export default App
