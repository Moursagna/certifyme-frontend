import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
});

export const fetchDashboardStats = () => api.get('/dashboard');

export const fetchStudents = () => api.get('/students');
export const createStudent = (payload) => api.post('/students', payload);
export const updateStudent = (id, payload) => api.put(`/students/${id}`, payload);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export const fetchCertificates = () => api.get('/certificates');
export const createCertificate = ({ certificateId, title, issuedBy, issueDate, expiryDate, studentId }) =>
  api.post('/certificates', { certificateId, title, issuedBy, issueDate, expiryDate, studentId });
export const updateCertificate = (id, payload) => api.put(`/certificates/${id}`, payload);
export const revokeCertificate = (id) => api.put(`/certificates/${id}/revoke`);
export const deleteCertificate = (id) => api.delete(`/certificates/${id}`);

export const verifyCertificate = (certificateId) => api.get(`/certificates/verify/${certificateId}`);

export default api;
