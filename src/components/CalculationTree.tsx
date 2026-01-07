import React from 'react';
import { OperationNode } from '../types';
import CreateOperationForm from './CreateOperationForm';

interface CalculationTreeProps {
  nodes: OperationNode[];
  onOperationCreated: () => void;
  isAuthenticated: boolean;
}

const CalculationTree: React.FC<CalculationTreeProps> = ({ nodes, onOperationCreated, isAuthenticated }) => {
  const formatOperation = (node: OperationNode): string => {
    if (node.type === 'starting') {
      return `Started the thread with ${node.value}`;
    }
    const symbol = {
      add: '+',
      subtract: '-',
      multiply: '×',
      divide: '÷'
    }[node.operation_type!];
    return `${symbol} ${node.right_operand}`;
  };

  const renderNode = (node: OperationNode, depth: number = 0): React.ReactNode => {
    const displayName = node.username || `user-${node.user_id}`;

    return (
      <div
        key={node.id}
        className="relative mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 shadow-sm shadow-slate-950/40"
        style={{ marginLeft: `${depth * 16}px` }}
      >
        {depth > 0 && (
          <div className="absolute -left-4 top-4 h-px w-4 bg-slate-700/70" />
        )}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-100">
            {node.value}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-100">@{displayName}</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-slate-400">
                  {new Date(node.created_at).toLocaleString()}
                </span>
              </div>
              {node.type !== 'starting' && node.operation_type && (
                <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                  {node.operation_type}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-200">
              {formatOperation(node)}
            </p>
          </div>
        </div>
        {isAuthenticated && (
          <CreateOperationForm
            parentId={node.id}
            parentType={node.type}
            onOperationCreated={onOperationCreated}
          />
        )}
        {node.children.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 px-6 py-10 text-sm text-slate-400">
        No conversations yet. Be the first to start a number thread!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {nodes.map((node) => renderNode(node))}
    </div>
  );
};

export default CalculationTree;
