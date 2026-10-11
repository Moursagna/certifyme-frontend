import { useEffect, useState } from 'react';
import {
  createCertificate,
  deleteCertificate,
  fetchCertificates,
  fetchStudents,
  revokeCertificate,
  updateCertificate,
} from '../services/api';

const emptyForm = {
  certificateId: '',
  title: '',
  issuedBy: '',
  issueDate: '',
  expiryDate: '',
  studentId: '',
};

const getErrorMessage = (err, fallback) => {
  const responseData = err.response?.data;
  if (typeof responseData?.message === 'string') {
    return responseData.message;
  }

  if (responseData && typeof responseData === 'object') {
    const validationMessages = Object.values(responseData).filter(
      (message) => typeof message === 'string',
    );
    if (validationMessages.length > 0) {
      return validationMessages.join(' ');
    }
  }

  return fallback;
};

const getCertificateStatus = (certificate) => {
  if (certificate.revoked) {
    return 'REVOKED';
  }

  const today = new Date();
  const todayLocal = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  if (certificate.expiryDate && certificate.expiryDate < todayLocal) {
    return 'EXPIRED';
  }

  return 'VALID';
};

function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchCertificates(), fetchStudents()])
      .then(([certificatesResponse, studentsResponse]) => {
        setCertificates(certificatesResponse.data);
        setStudents(studentsResponse.data);
        setError('');
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load certificates and students. Check the backend connection and try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      studentId: Number(form.studentId),
    };

    const request = editingId
      ? updateCertificate(editingId, payload)
      : createCertificate(payload);

    request
      .then(() => {
        setSuccess(editingId ? 'Certificate updated successfully.' : 'Certificate issued successfully.');
        setError('');
        resetForm();
        loadData();
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Certificate operation failed. Check the entered details and try again.'));
      });
  };

  const handleEdit = (certificate) => {
    setEditingId(certificate.id);
    setForm({
      certificateId: certificate.certificateId,
      title: certificate.title,
      issuedBy: certificate.issuedBy,
      issueDate: certificate.issueDate || '',
      expiryDate: certificate.expiryDate || '',
      studentId: String(certificate.studentId),
    });
  };

  const handleRevoke = (id) => {
    revokeCertificate(id)
      .then(() => {
        setSuccess('Certificate revoked.');
        setError('');
        loadData();
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Could not revoke this certificate. Please try again.'));
      });
  };

  const handleDelete = (id) => {
    deleteCertificate(id)
      .then(() => {
        setSuccess('Certificate deleted.');
        setError('');
        loadData();
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Could not delete this certificate. Please try again.'));
      });
  };

  const studentNamesById = new Map(
    students.map((student) => [
      String(student.id),
      `${student.firstName || ''} ${student.lastName || ''}`.trim(),
    ]),
  );

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Management</p>
          <h2>Certificates</h2>
          <p className="page-description">Issue and manage student credentials.</p>
        </div>
      </div>

      {error && <p className="alert-box error" role="alert">{error}</p>}
      {success && <p className="alert-box success" role="status">{success}</p>}

      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="grid-two">
          <label>
            Certificate ID
            <input
              name="certificateId"
              value={form.certificateId}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </label>
          <label>
            Student
            <select name="studentId" value={form.studentId} onChange={handleChange} required>
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </label>
          <label className="span-full">
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Issue Authority
            <input name="issuedBy" value={form.issuedBy} onChange={handleChange} required />
          </label>
          <label>
            Expiry Date
            <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
          </label>
          <label>
            Issue Date
            <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} required />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {editingId ? 'Update Certificate' : 'Issue Certificate'}
          </button>
          {editingId && (
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="loading-state" role="status">
          <span className="loading-indicator" aria-hidden="true" />
          <span>Loading certificates and students...</span>
        </div>
      ) : error && certificates.length === 0 ? (
        <div className="empty-state-panel">
          <p>Certificate records are unavailable right now.</p>
          <button type="button" className="secondary-btn" onClick={loadData}>Try again</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Certificate ID</th>
                <th scope="col">Student</th>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No certificates issued yet. Use the form above to issue one.</td>
                </tr>
              ) : (
                certificates.map((certificate) => {
                  const studentName = studentNamesById.get(String(certificate.studentId));
                  const status = getCertificateStatus(certificate);
                  const isRevoked = status === 'REVOKED';
                  return (
                    <tr key={certificate.id}>
                      <td><span className="certificate-id">{certificate.certificateId}</span></td>
                      <td>{studentName || 'Unknown student'}</td>
                      <td>{certificate.title}</td>
                      <td>
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          <span className="status-dot" aria-hidden="true" />
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="inline-actions">
                          <button type="button" className="table-action" onClick={() => handleEdit(certificate)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="table-action"
                            onClick={() => handleRevoke(certificate.id)}
                            disabled={isRevoked}
                          >
                            {isRevoked ? 'Revoked' : 'Revoke'}
                          </button>
                          <button type="button" className="table-action destructive" onClick={() => handleDelete(certificate.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CertificatesPage;
