import Employee from "../model/employeeModel.js";

export const create = async (req, res) => {

    try {
        const newEmployee = new Employee(req.body);
        const email = req.body.email;
        const existingEmployee = await Employee.findOne({email: email});
        if(existingEmployee){
            return res.status(400).json({message: "Employee with this email already exists"});
        }
        await newEmployee.save();
       // res.status(201).json(newEmployee);
       return res.status(200).json({message: "Employee added successfully"});
    }

    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

export const getAll = async (req,res) => {
    try {
        const employees = await Employee.find();
        if(employees.length === 0){
            return res.status(404).json({message: "No employees found"});
        }
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

export const getById = async (req,res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if(!employee){
            return res.status(404).json({message: "Employee not found"});
        }
        res.status(200).json(employee);
    }
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

 export const update = async (req,res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!employee){
            return res.status(404).json({message: "Employee not found"});
        }
        res.status(200).json(employee);
    }
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const deleteEmp = async (req,res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if(!employee){
            return res.status(404).json({message: "Employee not found"});
        }
        res.status(200).json({message: "Employee deleted successfully"});
    }
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}
