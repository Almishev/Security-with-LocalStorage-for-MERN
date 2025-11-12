import express from "express";

import { create, getAll, getById, update, deleteEmp, addKudos } from "../controller/employeeController.js";
import { authenticateToken } from "../auth/middleware.js";
import { requireAdmin } from "../auth/middleware.js";

const router = express.Router();

router.post("/employees", authenticateToken, requireAdmin, create);
router.get("/employees", authenticateToken, getAll);
router.get("/employees/:id", authenticateToken, getById);
router.put("/employees/:id", authenticateToken, requireAdmin,update);
router.delete("/employees/:id", authenticateToken, requireAdmin,deleteEmp);
router.post("/employees/:id/kudos", authenticateToken, addKudos);


export default router;


