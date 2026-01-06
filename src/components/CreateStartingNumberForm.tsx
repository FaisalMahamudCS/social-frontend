import React, { useState } from 'react';
import { createStartingNumber } from '../api/calculations';

interface CreateStartingNumberFormProps {
  onNumberCreated: () => void;
}

const CreateStartingNumberForm: React.FC<CreateStartingNumberFormProps> = ({ onNumberCreated }) => {
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const num = parseFloat(number);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    setLoading(true);

    try {
      await createStartingNumber({ number: num });
      setNumber('');
      onNumberCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: '15px' }}>Start a New Calculation Chain</h3>
      <div className="form-group">
        <label>Starting Number</label>
        <input
          type="number"
          step="any"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a number"
          required
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? 'Creating...' : 'Create Starting Number'}
      </button>
    </form>
  );
};

export default CreateStartingNumberForm;
