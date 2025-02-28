import React, { useState } from "react";
import "../styles/EmployeePersonalDetails.css";

const statesData = {
  Maharashtra: {
    Pune: ["Haveli", "Mulshi", "Junnar"],
    Mumbai: ["Andheri", "Borivali", "Dadar"],
  },
  Karnataka: {
    Bangalore: ["Hebbal", "Whitefield", "Koramangala"],
    Mysore: ["Nanjangud", "Hunsur", "Periyapatna"],
  },
};

export default function EmployeePersonalDetails() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState({
    street: "",
    landmark: "",
    locality: "",
    state: "",
    district: "",
    taluka: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleStateChange = (e) => {
    setAddress({ ...address, state: e.target.value, district: "", taluka: "" });
  };

  const handleDistrictChange = (e) => {
    setAddress({ ...address, district: e.target.value, taluka: "" });
  };

  const validateForm = () => {
    let errors = {};
    const mobileRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!fullName.trim()) errors.fullName = "Full Name is required";
    if (!mobileRegex.test(mobile)) errors.mobile = "Enter a valid 10-digit mobile number";
    if (!dob) errors.dob = "Date of Birth is required";
    if (!gender) errors.gender = "Select your gender";
    if (!address.state) errors.state = "Select your state";
    if (!address.district) errors.district = "Select your district";
    if (!address.taluka) errors.taluka = "Select your taluka";
    if (!pincodeRegex.test(address.pincode)) errors.pincode = "Enter a valid 6-digit Pincode";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form Submitted Successfully!");
    }
  };

  return (
    <div className="EmpPerDet">
    <div className="form-container">
      <h1>Employee Personal Details</h1>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>

        {/* Mobile Number */}
        <div className="form-group">
          <label>Mobile Number</label>
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          {errors.mobile && <p className="error">{errors.mobile}</p>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          {errors.dob && <p className="error">{errors.dob}</p>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <div className="gender-group">
            <input type="radio" name="gender" value="Male" onChange={(e) => setGender(e.target.value)} /> Male
            <input type="radio" name="gender" value="Female" onChange={(e) => setGender(e.target.value)} /> Female
          </div>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        {/* Address Fields */}
        <div className="form-group">
          <label>Street</label>
          <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Landmark</label>
          <input type="text" value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Locality/Ward</label>
          <input type="text" value={address.locality} onChange={(e) => setAddress({ ...address, locality: e.target.value })} />
        </div>

        <div className="form-group">
          <label>State</label>
          <select value={address.state} onChange={handleStateChange}>
            <option value="">Select State</option>
            {Object.keys(statesData).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="error">{errors.state}</p>}
        </div>

        <div className="form-group">
          <label>District</label>
          <select value={address.district} onChange={handleDistrictChange} disabled={!address.state}>
            <option value="">Select District</option>
            {address.state && Object.keys(statesData[address.state]).map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          {errors.district && <p className="error">{errors.district}</p>}
        </div>

        <div className="form-group">
          <label>Taluka</label>
          <select value={address.taluka} onChange={(e) => setAddress({ ...address, taluka: e.target.value })} disabled={!address.district}>
            <option value="">Select Taluka</option>
            {address.district && statesData[address.state][address.district].map((taluka) => (
              <option key={taluka} value={taluka}>{taluka}</option>
            ))}
          </select>
          {errors.taluka && <p className="error">{errors.taluka}</p>}
        </div>

        <div className="form-group">
          <label>Pincode</label>
          <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
          {errors.pincode && <p className="error">{errors.pincode}</p>}
        </div>

        {/* Save & Next Button */}
        <button type="submit" className="submit-btn">Save & Next</button>
      </form>
    </div>
    </div>
  );
}