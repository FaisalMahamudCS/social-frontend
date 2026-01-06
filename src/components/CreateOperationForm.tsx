import React, { useState } from 'react';
import { createOperation, CreateOperationData } from '../api/calculations';

interface CreateOperationFormProps {
  parentId: number;
  parentType: 'starting' | 'operation';
  onOperationCreated: () => void;
}

const CreateOperationForm: React.FC<CreateOperationFormProps> = ({
  parentId,
  parentType,
  onOperationCreated,
}) => {
  const [operationType, setOperationType] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');
  const [rightOperand, setRightOperand] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const operand = parseFloat(rightOperand);
    if (isNaN(operand)) {
      setError('Please enter a valid number');
      return;
    }

    if (operationType === 'divide' && operand === 0) {
      setError('Division by zero is not allowed');
      return;
    }

    setLoading(true);

    try {
      const data: CreateOperationData = {
        parent_id: parentId,
        parent_type: parentType,
        operation_type: operationType,
        right_operand: operand,
      };
      await createOperation(data);
      setRightOperand('');
      setShowForm(false);
      onOperationCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        className="btn btn-secondary"
        onClick={() => setShowForm(true)}
        style={{ marginTop: '10px', fontSize: '12px', padding: '5px 10px' }}
      >
        Respond
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
      <div className="form-group" style={{ marginBottom: '10px' }}>
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value as any)}
          style={{ width: 'auto', marginRight: '10px', display: 'inline-block' }}
        >
          <option value="add">+</option>
          <option value="subtract">-</option>
          <option value="multiply">×</option>
          <option value="divide">÷</option>
        </select>
        <input
          type="number"
          step="any"
          value={rightOperand}
          onChange={(e) => setRightOperand(e.target.value)}
          placeholder="Number"
          required
          style={{ width: '100px', display: 'inline-block', marginRight: '10px' }}
        />
        <button type="submit" className="btn btn-success" disabled={loading} style={{ fontSize: '12px', padding: '5px 10px' }}>
          {loading ? '...' : 'Submit'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setShowForm(false);
            setError('');
            setRightOperand('');
          }}
          style={{ fontSize: '12px', padding: '5px 10px', marginLeft: '5px' }}
        >
          Cancel
        </button>
      </div>
      {error && <div className="error" style={{ fontSize: '12px' }}>{error}</div>}
    </form>
  );
};

export default CreateOperationForm;
