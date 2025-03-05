import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EmployeeDetails.css";

const API_URL = "http://localhost:5010/api/employees";

const states = ["Maharashtra", "Karnataka"];
const districtsByState = {
  Maharashtra: [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
    "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
    "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  Karnataka: [
    "Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", 
    "Bengaluru (Bangalore) Rural", "Bengaluru (Bangalore) Urban", "Bidar",
    "Chamarajanagar", "Chikballapur", "Chikkamagaluru (Chikmagalur)", 
    "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag",
    "Hassan", "Haveri", "Kalaburagi (Gulbarga)", "Kodagu", "Kolar", 
    "Koppal", "Mandya", "Mysuru (Mysore)", "Raichur", "Ramanagara", 
    "Shivamogga (Shimoga)", "Tumakuru (Tumkur)", "Udupi", 
    "Uttara Kannada (Karwar)", "Vijayapura (Bijapur)", "Yadgir"
  ],
};
const talukasByDistrict = {

    "Ahmednagar": ["Ahmednagar", "Shrigonda", "Pathardi", "Shevgaon", "Rahuri", "Kopargaon", "Sangamner", "Akole", "Parner", "Jamkhed", "Rahata"],
    "Akola": ["Akola", "Balapur", "Murtizapur", "Telhara", "Patur", "Barshitakli"],
    "Amravati": ["Amravati", "Achalpur", "Morshi", "Chandur Bazar", "Daryapur", "Dhamangaon", "Nandgaon Khandeshwar", "Teosa", "Bhatkuli", "Chandur Railway", "Warud"],
    "Aurangabad": ["Aurangabad", "Gangapur", "Kannad", "Khuldabad", "Paithan", "Phulambri", "Sillod", "Soegaon", "Vaijapur"],
    "Beed": ["Beed", "Ashti", "Georai", "Kaij", "Parli", "Patoda", "Shirur", "Wadwani", "Dharur", "Ambajogai"],
    "Bhandara": ["Bhandara", "Mohadi", "Sakoli", "Lakhandur", "Lakhani", "Pauni", "Tumsar"],
    "Buldhana": ["Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Khamgaon", "Lonar", "Malkapur", "Mehkar", "Motala", "Nandura", "Shegaon", "Sindkhed Raja"],
    "Chandrapur": ["Chandrapur", "Ballarpur", "Brahmapuri", "Gondpipri", "Jivati", "Korpana", "Mul", "Nagbhid", "Pombhurna", "Rajura", "Sawali", "Warora"],
    "Dhule": ["Dhule", "Sakri", "Shirpur", "Sindkhede"],
    "Gadchiroli": ["Gadchiroli", "Aheri", "Armori", "Bhamragad", "Chamorshi", "Dhanora", "Desaiganj", "Etapalli", "Kurkheda", "Mulchera", "Sironcha"],
    "Gondia": ["Gondia", "Amgaon", "Arjuni Morgaon", "Deori", "Goregaon", "Sadak Arjuni", "Salekasa", "Tirora"],
    "Hingoli": ["Hingoli", "Aundha Nagnath", "Basmath", "Kalamnuri", "Sengaon"],
    "Jalgaon": ["Jalgaon", "Amalner", "Bhadgaon", "Bhusawal", "Bodwad", "Chalisgaon", "Chopda", "Dharangaon", "Erandol", "Jamner", "Muktainagar", "Pachora", "Parola", "Raver", "Yawal"],
    "Jalna": ["Jalna", "Ambad", "Badnapur", "Bhokardan", "Ghansawangi", "Jafrabad", "Mantha", "Partur"],
    "Kolhapur": ["Kolhapur", "Ajara", "Bavda", "Chandgad", "Gadhinglaj", "Hatkanangale", "Kagal", "Karveer", "Panhala", "Radhanagari", "Shahuwadi", "Shirol"],
    "Latur": ["Latur", "Ahmadpur", "Ausa", "Chakur", "Deoni", "Jalkot", "Nilanga", "Renapur", "Shirur Anantpal", "Udgir"],
    "Mumbai City": ["Colaba", "Fort", "Malabar Hill", "Byculla", "Dadar", "Mahim"],
    "Mumbai Suburban": ["Andheri", "Bandra", "Borivali", "Dahisar", "Goregaon", "Jogeshwari", "Kandivali", "Kurla", "Malad", "Mulund", "Powai", "Vile Parle"],
    "Nagpur": ["Nagpur", "Hingna", "Kamthi", "Kuhi", "Mauda", "Nagpur Rural", "Narkhed", "Parshivni", "Ramtek", "Savner", "Umred"],
    "Nanded": ["Nanded", "Ardhapur", "Bhokar", "Biloli", "Deglur", "Dharmabad", "Hadgaon", "Himayatnagar", "Kandhar", "Kinwat", "Loha", "Mahur", "Mudkhed", "Mukhed", "Naigaon", "Umri"],
    "Nandurbar": ["Nandurbar", "Akkalkuwa", "Akrani", "Shahada", "Taloda", "Navapur"],
    "Nashik": ["Nashik", "Baglan", "Chandvad", "Deola", "Dindori", "Igatpuri", "Kalwan", "Malegaon", "Manmad", "Nandgaon", "Niphad", "Peth", "Sinnar", "Surgana", "Trimbakeshwar", "Yeola"],
    "Osmanabad": ["Osmanabad", "Bhum", "Kalamb", "Lohara", "Omerga", "Paranda", "Tuljapur", "Washi"],
    "Palghar": ["Palghar", "Dahanu", "Jawhar", "Mokhada", "Talasari", "Vasai", "Vikramgad", "Wada"],
    "Parbhani": ["Parbhani", "Gangakhed", "Jintur", "Manwath", "Pathri", "Purna", "Sailu", "Sonpeth"],
    "Pune": ["Pune City", "Haveli", "Baramati", "Bhor", "Daund", "Indapur", "Junnar", "Khed", "Maval", "Mulshi", "Purandar", "Shirur", "Velhe", "Ambegaon"],
    "Raigad": ["Alibag", "Karjat", "Khalapur", "Mahad", "Mangaon", "Mhasla", "Murud", "Panvel", "Pen", "Poladpur", "Roha", "Shrivardhan", "Sudhagad", "Tala", "Uran"],
    "Ratnagiri": ["Ratnagiri", "Chiplun", "Dapoli", "Guhagar", "Khed", "Lanja", "Mandangad", "Rajapur", "Sangameshwar"],
    "Sangli": ["Sangli", "Atpadi", "Jat", "Kadegaon", "Kavathe Mahankal", "Khanapur", "Miraj", "Palus", "Shirala", "Tasgaon", "Walwa"],
    "Satara": ["Satara", "Jaoli", "Karad", "Khandala", "Khatav", "Mahabaleshwar", "Man", "Patan", "Phaltan", "Wai"],
    "Sindhudurg": ["Sindhudurg", "Devgad", "Kankavli", "Malvan", "Sawantwadi", "Vengurla", "Dodamarg"],
    "Solapur": ["Solapur", "Akkalkot", "Barshi", "Karmala", "Madha", "Mangalvedhe", "Malshiras", "Pandharpur", "Sangole"],
    "Thane": ["Thane", "Bhiwandi", "Kalyan", "Murbad", "Shahapur", "Ulhasnagar", "Ambarnath", "Vasai-Virar"],
    "Wardha": ["Wardha", "Arvi", "Ashti", "Deoli", "Hinganghat", "Karanja", "Samudrapur", "Seloo"],
    "Washim": ["Washim", "Karanja", "Malegaon", "Mangrulpir", "Manora", "Risod"],
    "Yavatmal": ["Yavatmal", "Arni", "Babhulgaon", "Darwha", "Digras", "Ghatanji", "Kalamb", "Mahagaon", "Maregaon", "Ner", "Pandharkawada", "Pusad", "Ralegaon", "Umarkhed", "Wani", "Zari Jamani"],
    "Bagalkot": ["Bagalkot", "Badami", "Bilagi", "Hungund", "Jamkhandi", "Mudhol"],
    "Ballari (Bellary)": ["Ballari", "Hosapete", "Hagaribommanahalli", "Hadagalli", "Kudligi", "Sandur", "Siruguppa"],
    "Belagavi (Belgaum)": ["Belagavi", "Athani", "Bailhongal", "Chikkodi", "Gokak", "Hukkeri", "Khanapur", "Ramdurg", "Raibag", "Saundatti"],
    "Bengaluru (Bangalore) Rural": ["Devanahalli", "Doddaballapura", "Hoskote", "Nelamangala"],
    "Bengaluru (Bangalore) Urban": ["Bangalore North", "Bangalore South", "Anekal", "Yelahanka"],
    "Bidar": ["Bidar", "Aurad", "Basavakalyan", "Bhalki", "Humnabad"],
    "Chamarajanagar": ["Chamarajanagar", "Gundlupet", "Kollegal", "Yelandur"],
    "Chikballapur": ["Chikballapur", "Bagepalli", "Chintamani", "Gauribidanur", "Gudibanda", "Sidlaghatta"],
    "Chikkamagaluru (Chikmagalur)": ["Chikkamagaluru", "Kadur", "Koppa", "Mudigere", "Narasimharajapura", "Sringeri", "Tarikere"],
    "Chitradurga": ["Chitradurga", "Challakere", "Hiriyur", "Holalkere", "Hosadurga", "Molakalmuru"],
    "Dakshina Kannada": ["Mangaluru", "Bantwal", "Belthangady", "Puttur", "Sullia"],
    "Davangere": ["Davangere", "Harihara", "Honnali", "Channagiri", "Jagalur"],
    "Dharwad": ["Dharwad", "Hubballi", "Kundgol", "Navalgund"],
    "Gadag": ["Gadag", "Mundargi", "Nargund", "Ron", "Shirahatti"],
    "Hassan": ["Hassan", "Arsikere", "Alur", "Arkalgud", "Belur", "Channarayapatna", "Holenarasipura", "Sakleshpur"],
    "Haveri": ["Haveri", "Byadgi", "Hanagal", "Hirekerur", "Ranebennur", "Savanur"],
    "Kalaburagi (Gulbarga)": ["Kalaburagi", "Aland", "Afzalpur", "Chincholi", "Chitapur", "Jevargi", "Sedam"],
    "Kodagu": ["Madikeri", "Somwarpet", "Virajpet"],
    "Kolar": ["Kolar", "Bangarapet", "Malur", "Mulbagal", "Srinivaspur"],
    "Koppal": ["Koppal", "Gangavathi", "Kushtagi", "Yelburga"],
    "Mandya": ["Mandya", "Krishnarajpet", "Maddur", "Malavalli", "Nagamangala", "Pandavapura", "Srirangapatna"],
    "Mysuru (Mysore)": ["Mysuru", "Heggadadevankote", "Krishnarajanagara", "Nanjangud", "Periyapatna", "T Narasipura", "Hunsur"],
    "Raichur": ["Raichur", "Deodurga", "Lingasugur", "Manvi", "Maski", "Sindhanur"],
    "Ramanagara": ["Ramanagara", "Channapatna", "Kanakapura", "Magadi"],
    "Shivamogga (Shimoga)": ["Shivamogga", "Bhadravati", "Hosanagara", "Sagar", "Shikaripura", "Sorab", "Thirthahalli"],
    "Tumakuru (Tumkur)": ["Tumakuru", "Chikkanayakanahalli", "Gubbi", "Koratagere", "Kunigal", "Madhugiri", "Pavagada", "Sira", "Tiptur", "Turuvekere"],
    "Udupi": ["Udupi", "Karkala", "Kundapura"],
    "Uttara Kannada (Karwar)": ["Karwar", "Ankola", "Bhatkal", "Haliyal", "Honnavar", "Joida", "Kumta", "Mundgod", "Siddapur", "Sirsi", "Yellapur"],
    "Vijayapura (Bijapur)": ["Vijayapura", "Basavana Bagewadi", "Indi", "Muddebihal", "Sindgi"],
    "Yadgir": ["Yadgir", "Shahapur", "Surpur"]
  
};


const departments = ["Sales", "Marketing", "Finance", "HR", "IT"];
const jobRolesByDepartment = {
  Sales: ["Sales Representative", "Sales Manager", "Account Executive"],
  Marketing: ["Marketing Coordinator", "Marketing Manager", "Digital Marketer"],
  Finance: ["Accountant", "Financial Analyst", "Finance Manager"],
  HR: ["HR Assistant", "HR Manager", "Recruiter"],
  IT: ["Software Developer", "System Administrator", "Database Administrator"],
};


export default function EmployeeDetails() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
  const [email, setEmail] = useState(loggedInUser.email || "");
  const [employeeData, setEmployeeData] = useState({
    employeeID: "",
    email: loggedInUser.email || "",
    fullName: "",
    mobile: "",
    dob: "",
    gender: "",
    department: "",
    jobRole: "",
    joinDate : "",
    branchName: "Venkatesh Multistate Tasgaon", // Default branch name
    address: {
      street: "",
      landmark: "",
      locality: "",
      state: "",
      district: "",
      taluka: "",
      pincode: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [jobRoles, setJobRoles] = useState([]); // Job roles based on department


  useEffect(() => {
    if (loggedInUser.fullName) {
      navigate("/EmployeeDashboard");
    }
  }, [loggedInUser, navigate]);
  const validateForm = () => {
    let validationErrors = {};
    const mobileRegex = /^[6-9]\d{9}$/; // Corrected line
    const pincodeRegex = /^\d{6}$/; //Corrected line
  
    if (!employeeData.fullName.trim()) {
      validationErrors.fullName = "Full Name is required";
    }
    if (!mobileRegex.test(employeeData.mobile)) {
      validationErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!employeeData.dob) {
      validationErrors.dob = "Date of Birth is required";
    }
    
    
    if (!employeeData.gender) {
      validationErrors.gender = "Gender is required";
    }
    if (!employeeData.address.state) {
      validationErrors.state = "State is required";
    }
    if (!employeeData.address.district) {
      validationErrors.district = "District is required";
    }
    if (!employeeData.address.pincode) {
      validationErrors.pincode = "Pincode is required";
    }
    if (!pincodeRegex.test(employeeData.address.pincode)) {
      validationErrors.pincode = "Enter a valid 6-digit Pincode";
    }
    if (!employeeData.department) {
      validationErrors.department = "Department is required";
    }
    if (!employeeData.jobRole) {
      validationErrors.jobRole = "Job Role is required";
    }
    if (!employeeData.joinDate) {
      validationErrors.joinDate = "Joining Date is required";
    }
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setEmployeeData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setEmployeeData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setEmployeeData((prev) => ({
      ...prev,
      address: { ...prev.address, state: newState, district: "", taluka: "" },
    }));
    setDistricts(districtsByState[newState] || []);
    setTalukas([]);
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setEmployeeData((prev) => ({
      ...prev,
      address: { ...prev.address, district: newDistrict, taluka: "" },
    }));
    setTalukas(talukasByDistrict[newDistrict] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(API_URL, employeeData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Employee saved successfully! Redirecting to login...");
      navigate("/login"); // Redirect to the login page

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error saving employee. Please try again.");
    }
  };

  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    setEmployeeData((prev) => ({
      ...prev,
      department: newDepartment,
      jobRole: "", // Reset job role when department changes
    }));
    setJobRoles(jobRolesByDepartment[newDepartment] || []);
  };
  return (
    <div className="EmpDetails">
      <div className="form-container">
        <h1>Complete Your Employee Details</h1>
        <form onSubmit={handleSubmit}>
          <h2>Personal Details</h2>

          <div className="form-group">

          <label>Email *</label>

          <input type="email" name="email" value={email} readOnly />

          </div>

          <div className="form-group">

          <label>Full Name *</label>

          <input type="text" name="fullName" value={employeeData.fullName} onChange={handleChange} />

          {errors.fullName && <span className="error">{errors.fullName}</span>}

          </div>

          <div className="form-group">

          <label>Mobile Number *</label>

          <input type="tel" name="mobile" value={employeeData.mobile} onChange={handleChange} />

          {errors.mobile && <span className="error">{errors.mobile}</span>}

          </div>

          <div className="form-group">

          <label>Date of Birth *</label>

          <input type="date" name="dob" value={employeeData.dob} onChange={handleChange} />

          </div>

          <div className="form-group">

          <label>Gender *</label>

          <select name="gender" value={employeeData.gender} onChange={handleChange}>

          <option value="">Select</option>

          <option value="Male">Male</option>

          <option value="Female">Female</option>

          </select>

          </div>
          <h2>Address Details</h2>

          <div className="form-group">
            <label>Street</label>
            <input type="text" name="address.street" value={employeeData.address.street} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Landmark</label>
            <input type="text" name="address.landmark" value={employeeData.address.landmark} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Locality</label>
            <input type="text" name="address.locality" value={employeeData.address.locality} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>State *</label>
            <select name="address.state" value={employeeData.address.state} onChange={handleStateChange}>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <span className="error">{errors.state}</span>}
          </div>
          <div className="form-group">
            <label>District *</label>
            <select name="address.district" value={employeeData.address.district} onChange={handleDistrictChange}>
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            {errors.district && <span className="error">{errors.district}</span>}
          </div>
          <div className="form-group">
            <label>Taluka</label>
            <select name="address.taluka" value={employeeData.address.taluka} onChange={handleChange}>
              <option value="">Select Taluka</option>
              {talukas.map((taluka) => (
                <option key={taluka} value={taluka}>{taluka}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Pincode *</label>
            <input type="text" name="address.pincode" value={employeeData.address.pincode} onChange={handleChange} />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
          </div>

          <h2>Professional Details</h2>

          <div className="form-group">
            <label>Branch Name</label>
            <input
              type="text"
              name="branchName"
              value={employeeData.branchName}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={employeeData.department}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && <span className="error">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label>Job Role *</label>
            <select
              name="jobRole"
              value={employeeData.jobRole}
              onChange={handleChange}
              disabled={!employeeData.department} // Disable if no department selected
            >
              <option value="">Select Job Role</option>
              {jobRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.jobRole && <span className="error">{errors.jobRole}</span>}
          </div>
          <div className="form-group">

<label>Joining Date *</label>

<input type="date" name="joinDate" value={employeeData.joinDate} onChange={handleChange} />

</div>
          <button type="submit" className="submit-btn">Save Details</button>
        </form>
      </div>
    </div>
  );
}