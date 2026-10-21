import React, { useState } from 'react';

/**
 * ============================================================================
 * PRACTICAL 3: Create a Student Management System using React Forms,
 *              Controlled Components and Validation.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. Controlled Components (Form inputs strictly driven by React State)
 *  2. Multi-input State Handling (Single handleChange function with dynamic keys)
 *  3. Form Validation (Email regex, Roll number, Name length, CGPA range)
 *  4. Inline Dynamic Error Messages & Submit Interception
 *  5. Dynamic Student Directory Table with Search & Delete Operations
 * ============================================================================
 */

export default function Practical3() {
  // Form State (Single object handling all controlled input values)
  const [formData, setFormData] = useState({
    rollNumber: '',
    fullName: '',
    email: '',
    course: '',
    gender: 'Male',
    cgpa: '',
    skills: []
  });

  // Validation Errors State
  const [errors, setErrors] = useState({});

  // Search Query State
  const [searchTerm, setSearchTerm] = useState('');

  // Student Directory State (Pre-populated with demo student records)
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNumber: '101',
      fullName: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      course: 'Computer Science',
      gender: 'Male',
      cgpa: '8.9',
      skills: ['React', 'Node.js']
    },
    {
      id: 2,
      rollNumber: '102',
      fullName: 'Diya Sharma',
      email: 'diya.sharma@example.com',
      course: 'Information Technology',
      gender: 'Female',
      cgpa: '9.4',
      skills: ['React', 'Python', 'UI/UX']
    }
  ]);

  // Skill Options for Checkboxes
  const availableSkills = ['React', 'Node.js', 'MongoDB', 'Python', 'UI/UX'];

  // -------------------------------------------------------------
  // CONTROLLED INPUT CHANGE HANDLER
  // -------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle array of skills
      let updatedSkills = [...formData.skills];
      if (checked) {
        updatedSkills.push(value);
      } else {
        updatedSkills = updatedSkills.filter((s) => s !== value);
      }
      setFormData((prev) => ({ ...prev, skills: updatedSkills }));
      // Clear error on change
      if (errors.skills && updatedSkills.length > 0) {
        setErrors((prev) => ({ ...prev, skills: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error dynamically as user types
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  // -------------------------------------------------------------
  // VALIDATION LOGIC
  // -------------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    // 1. Roll Number Validation
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required.';
    } else if (isNaN(formData.rollNumber) || Number(formData.rollNumber) <= 0) {
      newErrors.rollNumber = 'Roll number must be a valid positive integer.';
    } else if (students.some((s) => s.rollNumber === formData.rollNumber.trim())) {
      newErrors.rollNumber = 'Student with this Roll Number already exists.';
    }

    // 2. Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Full Name should contain letters and spaces only.';
    }

    // 3. Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g., student@domain.com).';
    }

    // 4. Course / Branch Selection
    if (!formData.course) {
      newErrors.course = 'Please select a Course / Branch.';
    }

    // 5. CGPA Validation
    if (!formData.cgpa.trim()) {
      newErrors.cgpa = 'CGPA is required.';
    } else {
      const gpa = parseFloat(formData.cgpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        newErrors.cgpa = 'CGPA must be a decimal number between 0.0 and 10.0.';
      }
    }

    // 6. Skills Selection
    if (formData.skills.length === 0) {
      newErrors.skills = 'Select at least one skill.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------------------------------------
  // SUBMIT HANDLER
  // -------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if form is invalid
    }

    const newStudent = {
      id: Date.now(),
      rollNumber: formData.rollNumber.trim(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      course: formData.course,
      gender: formData.gender,
      cgpa: parseFloat(formData.cgpa).toFixed(1),
      skills: formData.skills
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Reset Form to initial clean state
    setFormData({
      rollNumber: '',
      fullName: '',
      email: '',
      course: '',
      gender: 'Male',
      cgpa: '',
      skills: []
    });
    setErrors({});
  };

  // Delete Student
  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Filter students based on search
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.includes(searchTerm) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '24px 32px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header Banner */}
      <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px', fontSize: '0.9rem' }}>
        🎓 <strong>Practical 3:</strong> Create a Student Management System using React Forms, Controlled Components and Validation.
      </div>

      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', background: 'linear-gradient(135deg, #34d399, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Student Registration & Management System
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Demonstrates Controlled React Inputs, Real-Time Validation, and Data Grid Management.
        </p>
      </header>

      {/* Main Grid: Form on Left, Student Directory on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', alignItems: 'start' }}>
        {/* ========================================================= */}
        {/* SECTION 1: CONTROLLED REGISTRATION FORM                  */}
        {/* ========================================================= */}
        <div style={{ background: '#1e293b', padding: '28px', borderRadius: '14px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#34d399', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📝</span> Student Registration Form
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Roll Number Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. 105"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: '#0f172a', border: `1px solid ${errors.rollNumber ? '#ef4444' : '#475569'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.rollNumber && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>⚠️ {errors.rollNumber}</span>}
            </div>

            {/* Full Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Sneha Patel"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: '#0f172a', border: `1px solid ${errors.fullName ? '#ef4444' : '#475569'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>⚠️ {errors.fullName}</span>}
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. sneha@college.edu"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: '#0f172a', border: `1px solid ${errors.email ? '#ef4444' : '#475569'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>⚠️ {errors.email}</span>}
            </div>

            {/* Course Dropdown */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Course / Department *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: '#0f172a', border: `1px solid ${errors.course ? '#ef4444' : '#475569'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="">-- Select Course --</option>
                <option value="Computer Science">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
              {errors.course && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>⚠️ {errors.course}</span>}
            </div>

            {/* Gender Radio & CGPA in a row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Gender
                </label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  CGPA (0 - 10) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: '#0f172a', border: `1px solid ${errors.cgpa ? '#ef4444' : '#475569'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
                {errors.cgpa && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>⚠️ {errors.cgpa}</span>}
              </div>
            </div>

            {/* Skills Checkbox Group */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Technical Skills *
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {availableSkills.map((skill) => (
                  <label key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      name="skills"
                      value={skill}
                      checked={formData.skills.includes(skill)}
                      onChange={handleChange}
                    />
                    {skill}
                  </label>
                ))}
              </div>
              {errors.skills && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>⚠️ {errors.skills}</span>}
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
            >
              + Register Student
            </button>
          </form>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: STUDENT DIRECTORY TABLE                       */}
        {/* ========================================================= */}
        <div style={{ background: '#1e293b', padding: '28px', borderRadius: '14px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👥</span> Student Records ({filteredStudents.length})
            </h2>
            <input
              type="text"
              placeholder="🔍 Search name, roll, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #475569', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>Roll</th>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Course</th>
                  <th style={{ padding: '10px' }}>CGPA</th>
                  <th style={{ padding: '10px' }}>Skills</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      No students found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: '700', color: '#a78bfa' }}>{st.rollNumber}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <div>{st.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{st.email}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>{st.course}</td>
                      <td style={{ padding: '12px 10px', fontWeight: '700', color: '#34d399' }}>{st.cgpa}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {st.skills.map((sk) => (
                            <span key={sk} style={{ fontSize: '0.7rem', background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#94a3b8' }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(st.id)}
                          style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
