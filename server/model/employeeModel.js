import mongoose  from "mongoose";
const employeSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    secondName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    department: {type: String, required: true},
    salary: {type: Number, required: true},
    kudos : {type: Number, default: 0},
}, {timestamps: true});

export default mongoose.model("Employee", employeSchema);

