import { useEffect, useState } from 'react';
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
} from '../services/api';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
};

const getStudentErrorMessage = (err, fallback) => {
  const responseData = err.response?.data;
  if (typeof responseData?.message === 'string') {
    return responseData.message;
  }

  if (responseData && typeof responseData === 'object') {
    const fieldErrors = Object.entries(responseData)
      .filter(([, message]) => typeof message === 'string')
      .map(([field, message]) => `${field}: ${message}`);
    if (fieldErrors.length > 0) {
      return fieldErrors.join(' ');
    }
  }

  return fallback;
};

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const loadStudents = () => {
    fetchStudents()
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to fetch students. Check the backend server.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'phone' && phoneError && /^\d{10}$/.test(value)) {
      setPhoneError('');
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPhoneError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) {
      setPhoneError('Phone number must contain exactly 10 digits');
      return;
    }
    setPhoneError('');

    const payload = { ...form };

    const request = editingId
      ? updateStudent(editingId, payload)
      : createStudent(payload);

    request
      .then(() => {
        setSuccess(editingId ? 'Student updated successfully.' : 'Student created successfully.');
        setError('');
        resetForm();
        loadStudents();
      })
      .catch((err) => {
        setError(getStudentErrorMessage(err, 'Student operation failed. Check the entered details and try again.'));
      });
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setPhoneError('');
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      department: student.department,
    });
  };

  const handleDelete = (id) => {
    deleteStudent(id)
      .then(() => {
        setSuccess('Student deleted.');
        setError('');
        loadStudents();
      })
      .catch((err) => {
        setError(getStudentErrorMessage(err, 'Unable to delete student. Please try again.'));
      });
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Management</p>
          <h2>Students</h2>
        </div>
      </div>

      {error && <p className="alert-box error">{error}</p>}
      {success && <p className="alert-box success">{success}</p>}

      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="grid-two">
          <label>
            First Name
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Last Name
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={handleChange}
              placeholder="10 digits"
              aria-invalid={Boolean(phoneError)}
              aria-describedby={phoneError ? 'phone-error' : undefined}
            />
            {phoneError && <span id="phone-error" className="field-error">{phoneError}</span>}
          </label>
          <label className="span-full">
            Department
            <input name="department" value={form.department} onChange={handleChange} required />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {editingId ? 'Update Student' : 'Add Student'}
          </button>
          {editingId && (
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="state-text">Loading students...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.department}</td>
                    <td>
                      <div className="inline-actions">
                        <button type="button" className="secondary-btn" onClick={() => handleEdit(student)}>
                          Edit
                        </button>
                        <button type="button" className="danger-btn" onClick={() => handleDelete(student.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentsPage;
