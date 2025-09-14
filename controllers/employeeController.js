import Employee from "../models/employeeModel.js";

// ➤ Add Employee
export const addEmployee = async (req, res) => {
  try {
    const { name, position, contact, salary } = req.body;
    const adminId = req.user._id;   // ✅ Taken from JWT token (authMiddleware)

    const employee = new Employee({ adminId, name, position, contact, salary });
    await employee.save();

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error adding employee", error: error.message });
  }
};


// ➤ Get Employees for Logged-in Admin
export const getEmployees = async (req, res) => {
  try {
    const adminId = req.user._id;
    const employees = await Employee.find({ adminId });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
};

// ➤ Add Leave to Employee
export const addLeave = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate, reason } = req.body;
    const adminId = req.user._id;

    const employee = await Employee.findOne({ _id: employeeId, adminId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.leaves.push({ startDate, endDate, reason });
    await employee.save();

    res.status(201).json({ message: "Leave added successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error adding leave", error: error.message });
  }
};

// ➤ Add Payment to Employee
export const addPayment = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { amount, method } = req.body;
    const adminId = req.user._id;

    const employee = await Employee.findOne({ _id: employeeId, adminId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.payments.push({ amount, method });
    await employee.save();

    res.status(201).json({ message: "Payment recorded successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error adding payment", error: error.message });
  }
};
