import express from "express";

import { create, getAll, getById, update, deleteEmp } from "../controller/employeeController.js";
import { authenticateToken } from "../auth/middleware.js";

const router = express.Router();

router.post("/employees", authenticateToken, create);
router.get("/employees", authenticateToken, getAll);
router.get("/employees/:id", authenticateToken, getById);
router.put("/employees/:id", authenticateToken, update);
router.delete("/employees/:id", authenticateToken, deleteEmp);


export default router;


