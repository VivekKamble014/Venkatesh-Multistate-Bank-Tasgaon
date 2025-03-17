import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeID: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  department: { type: String, required: true },
  jobRole: { type: String, required: true },
  joinDate : { type: String,require: true },
  branchName: {type: String, required: false},
  address: {
    street: String,
    landmark: String,
    locality: String,
    state: { type: String, required: true },
    district: { type: String, required: true },
    taluka: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  profileUpdate: { type: Boolean, default: false },
});

const Employee = mongoose.model("users", employeeSchema);

export default Employee;
