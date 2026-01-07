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
        className="mt-2 inline-flex items-center rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-medium text-[#5B4BFF] shadow-sm transition hover:border-[#5B4BFF] hover:bg-[#EEF2FF]"
        onClick={() => setShowForm(true)}
      >
        Reply with an operation
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 rounded-xl border border-[#E2E8F0] bg-white/90 p-3 shadow-sm shadow-[#5B4BFF1A]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value as any)}
          className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-2 text-xs text-[#0F172A] outline-none focus:border-[#5B4BFF] focus:ring-1 focus:ring-[#5B4BFF]/50"
        >
          <option value="add">+ Add</option>
          <option value="subtract">− Subtract</option>
          <option value="multiply">× Multiply</option>
          <option value="divide">÷ Divide</option>
        </select>
        <input
          type="number"
          step="any"
          value={rightOperand}
          onChange={(e) => setRightOperand(e.target.value)}
          placeholder="Number"
          required
          className="h-9 w-24 rounded-lg border border-[#E2E8F0] bg-white px-2 text-xs text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#5B4BFF] focus:ring-1 focus:ring-[#5B4BFF]/50"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-[#5B4BFF] px-3 py-1.5 text-[11px] font-medium text-white shadow-sm shadow-[#5B4BFF55] transition hover:bg-[#4A3DE0] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Posting…' : 'Post reply'}
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-medium text-[#0F172A] hover:border-[#5B4BFF] hover:text-[#5B4BFF]"
          onClick={() => {
            setShowForm(false);
            setError('');
            setRightOperand('');
          }}
        >
          Cancel
        </button>
      </div>
      {error && (
        <div className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-[11px] text-red-200">
          {error}
        </div>
      )}
    </form>
  );
};

export default CreateOperationForm;
