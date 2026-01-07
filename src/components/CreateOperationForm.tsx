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
        className="mt-2 inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800"
        onClick={() => setShowForm(true)}
      >
        Reply with an operation
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-sm shadow-slate-950/40"
    >
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value as any)}
          className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-2 text-xs text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40"
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
          className="h-9 w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Posting…' : 'Post reply'}
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
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
        <div className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-[11px] text-red-300">
          {error}
        </div>
      )}
    </form>
  );
};

export default CreateOperationForm;
