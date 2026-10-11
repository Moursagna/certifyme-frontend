import { useState } from 'react';
import { verifyCertificate } from '../services/api';

function VerificationPage() {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    verifyCertificate(certificateId)
      .then((response) => {
        setResult(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Verification failed. Please check the certificate ID.');
        setResult(null);
        setLoading(false);
      });
  };

  return (
    <div className="page-block">
      <div className="page-header">
        <div>
          <p className="eyebrow">Public check</p>
          <h2>Certificate Verification</h2>
        </div>
      </div>

      <form className="verification-form" onSubmit={handleSubmit}>
        <label>
          Certificate ID
          <input
            value={certificateId}
            onChange={(event) => setCertificateId(event.target.value)}
            placeholder="Enter certificate ID"
            required
          />
        </label>
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Checking...' : 'Verify'}
        </button>
      </form>

      {error && <p className="alert-box error">{error}</p>}

      {result && (
        <div className={`verification-result ${result.status.toLowerCase()}`} role="status">
          <h3>{result.status}</h3>
          <p>{result.message}</p>
          {result.studentName && <p>Student: {result.studentName}</p>}
        </div>
      )}
    </div>
  );
}

export default VerificationPage;
