import { createContext, useState } from "react";

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState({
    EmployeeID: `EMP${Date.now()}`, // Generate Employee ID
    EmailID: "",
    Password: "",
    FullName: "",
    MobileNo: "",
    DateOfBirth: "",
    Gender: "",
    Address: {
      Street: "",
      Landmark: "",
      Locality: "",
      State: "",
      District: "",
      Taluka: "",
      Pincode: "",
    },
    BankBranch: " Venkatesh Multistate Bank ,Tasgaon ",
    Department: "",
    JobRole: "",
    VehicleOwnership: "",
  });

  return (
    <RegistrationContext.Provider value={{ employeeData, setEmployeeData }}>
      {children}
    </RegistrationContext.Provider>
  );
};