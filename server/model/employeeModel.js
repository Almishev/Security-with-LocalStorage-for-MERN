import mongoose  from "mongoose";
const employeSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    secondtName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    department: {type: String, required: true},
    salary: {type: Number, required: true},
}, {timestamps: true});

export default mongoose.model("Employee", employeSchema);

