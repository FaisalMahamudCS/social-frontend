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
    <form
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/40 backdrop-blur"
      onSubmit={handleSubmit}
    >
      <h3 className="text-sm font-semibold text-slate-50">
        Start a new thread
      </h3>
      <p className="mt-1 text-xs text-slate-400">
        Pick a starting number. Others will reply by adding, subtracting, multiplying, or dividing.
      </p>
      <div className="mt-4 space-y-2">
        <label className="text-xs font-medium text-slate-300">
          Starting number
        </label>
        <input
          type="number"
          step="any"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="e.g. 42"
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 outline-none ring-0 transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>
      {error && (
        <div className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="mt-4 inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading}
      >
        {loading ? 'Creating…' : 'Create starting number'}
      </button>
    </form>
  );
};

export default CreateStartingNumberForm;
