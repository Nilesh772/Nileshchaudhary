/**
 * ============================================================================
 * PRACTICAL 7: Build RESTful APIs for Student Records Management
 *              using Express.js and Postman testing.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. REST Architectural Constraints (Stateless, Resource-based URIs, Uniform Interface)
 *  2. RESTful Resource Routing (/api/v1/students)
 *  3. Pagination, Filtering, and Query String Parsing
 *  4. Strict Request Body Validation (Email regex, CGPA boundaries, Roll No uniqueness)
 *  5. Aggregation / Analytical Endpoint for Student Statistics
 *  6. Postman Test Suite Ready (accompanied by Practical-7-Postman-Collection.json)
 * ============================================================================
 * How to Run:
 *   node Practical-7.js
 * Default Port: 5001 (Access at http://localhost:5001)
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[REST API] ${req.method} ${req.url}`);
  next();
});

// -------------------------------------------------------------
// DATA STORE: Student Records Repository
// -------------------------------------------------------------
let students = [
  {
    id: 1,
    rollNo: '2024CS01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gtu.edu',
    department: 'Computer Science',
    semester: 6,
    cgpa: 8.85,
    enrolledAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 2,
    rollNo: '2024CS02',
    name: 'Pooja Patel',
    email: 'pooja.patel@gtu.edu',
    department: 'Computer Science',
    semester: 6,
    cgpa: 9.35,
    enrolledAt: '2024-01-16T00:00:00.000Z'
  },
  {
    id: 3,
    rollNo: '2024IT01',
    name: 'Rohan Verma',
    email: 'rohan.verma@gtu.edu',
    department: 'Information Technology',
    semester: 4,
    cgpa: 7.9,
    enrolledAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: 4,
    rollNo: '2024AI01',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gtu.edu',
    department: 'Artificial Intelligence',
    semester: 4,
    cgpa: 9.1,
    enrolledAt: '2024-02-10T00:00:00.000Z'
  }
];

let nextStudentId = 5;

// -------------------------------------------------------------
// RESTFUL ROUTER: /api/v1/students
// -------------------------------------------------------------
const router = express.Router();

/**
 * @route   GET /api/v1/students/stats/analytics
 * @desc    Statistical summary of student records (Average CGPA, Department Counts)
 */
router.get('/stats/analytics', (req, res) => {
  const totalStudents = students.length;

  if (totalStudents === 0) {
    return res.status(200).json({
      success: true,
      message: 'No student data available.',
      data: { totalStudents: 0, averageCgpa: 0, departmentBreakdown: {} }
    });
  }

  const totalCgpa = students.reduce((acc, s) => acc + s.cgpa, 0);
  const avgCgpa = (totalCgpa / totalStudents).toFixed(2);

  const departmentBreakdown = students.reduce((acc, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {});

  return res.status(200).json({
    success: true,
    data: {
      totalStudents,
      averageCgpa: Number(avgCgpa),
      departmentBreakdown
    }
  });
});

/**
 * @route   GET /api/v1/students
 * @desc    Get all students with query filters (department, minCgpa, search, pagination)
 */
router.get('/', (req, res) => {
  let filtered = [...students];
  const { department, minCgpa, search, page = 1, limit = 10 } = req.query;

  // Department Filter
  if (department) {
    filtered = filtered.filter(
      (s) => s.department.toLowerCase() === department.toLowerCase()
    );
  }

  // Minimum CGPA Filter
  if (minCgpa) {
    const minVal = parseFloat(minCgpa);
    if (!isNaN(minVal)) {
      filtered = filtered.filter((s) => s.cgpa >= minVal);
    }
  }

  // Search Filter (by Name or Roll Number)
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
    );
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedData = filtered.slice(startIndex, startIndex + limitNum);

  return res.status(200).json({
    success: true,
    count: paginatedData.length,
    totalRecords: filtered.length,
    page: pageNum,
    totalPages: Math.ceil(filtered.length / limitNum),
    data: paginatedData
  });
});

/**
 * @route   GET /api/v1/students/:id
 * @desc    Get single student by numeric ID
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${id} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * @route   GET /api/v1/students/roll/:rollNo
 * @desc    Search student by Roll Number
 */
router.get('/roll/:rollNo', (req, res) => {
  const rollNo = req.params.rollNo.trim().toUpperCase();
  const student = students.find((s) => s.rollNo.toUpperCase() === rollNo);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with Roll Number ${rollNo} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * @route   POST /api/v1/students
 * @desc    Create new student record with validation
 */
router.post('/', (req, res) => {
  const { rollNo, name, email, department, semester, cgpa } = req.body;

  // Validation
  if (!rollNo || !name || !email || !department) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: rollNo, name, email, department are mandatory.'
    });
  }

  // Roll Number Uniqueness
  const duplicateRoll = students.some(
    (s) => s.rollNo.toUpperCase() === rollNo.trim().toUpperCase()
  );
  if (duplicateRoll) {
    return res.status(409).json({
      success: false,
      message: `Conflict: Student with roll number "${rollNo}" already exists.`
    });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address format.'
    });
  }

  // CGPA validation
  const cgpaNum = parseFloat(cgpa);
  if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
    return res.status(400).json({
      success: false,
      message: 'CGPA must be a number between 0.0 and 10.0.'
    });
  }

  const newStudent = {
    id: nextStudentId++,
    rollNo: rollNo.trim().toUpperCase(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    department: department.trim(),
    semester: parseInt(semester, 10) || 1,
    cgpa: Number(cgpaNum.toFixed(2)),
    enrolledAt: new Date().toISOString()
  };

  students.push(newStudent);

  return res.status(201).json({
    success: true,
    message: 'Student record registered successfully.',
    data: newStudent
  });
});

/**
 * @route   PUT /api/v1/students/:id
 * @desc    Update student record
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Cannot update: Student with ID ${id} not found.`
    });
  }

  const existing = students[studentIndex];
  const { name, email, department, semester, cgpa } = req.body;

  if (name) existing.name = name.trim();
  if (email) existing.email = email.trim().toLowerCase();
  if (department) existing.department = department.trim();
  if (semester) existing.semester = parseInt(semester, 10);
  if (cgpa !== undefined) existing.cgpa = Number(parseFloat(cgpa).toFixed(2));

  return res.status(200).json({
    success: true,
    message: `Student ID ${id} record updated successfully.`,
    data: existing
  });
});

/**
 * @route   DELETE /api/v1/students/:id
 * @desc    Delete a student record
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Cannot delete: Student with ID ${id} not found.`
    });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  return res.status(200).json({
    success: true,
    message: `Student "${deletedStudent.name}" removed successfully.`,
    deletedStudent
  });
});

// Mount Routes
app.use('/api/v1/students', router);

// Root Documentation Route
app.get('/', (req, res) => {
  res.json({
    api: 'Student Records Management RESTful API',
    version: '1.0.0',
    practical: 'Practical 7',
    endpoints: {
      getAllStudents: 'GET /api/v1/students',
      getSingleStudent: 'GET /api/v1/students/:id',
      searchByRollNo: 'GET /api/v1/students/roll/:rollNo',
      createStudent: 'POST /api/v1/students',
      updateStudent: 'PUT /api/v1/students/:id',
      deleteStudent: 'DELETE /api/v1/students/:id',
      analyticsStats: 'GET /api/v1/students/stats/analytics'
    }
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'REST Resource not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🎓 Practical 7 Student REST API Server Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📡 Endpoints: http://localhost:${PORT}/api/v1/students`);
  console.log(`📮 Postman Ready!`);
  console.log(`=======================================================`);
});

module.exports = app;
