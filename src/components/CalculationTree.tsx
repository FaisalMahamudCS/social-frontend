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
        className="relative mt-3 rounded-xl border border-[#E2E8F0] bg-white/90 p-3 shadow-sm shadow-[#5B4BFF1A]"
        style={{ marginLeft: `${depth * 16}px` }}
      >
        {depth > 0 && (
          <div className="absolute -left-4 top-4 h-px w-4 bg-[#E2E8F0]" />
        )}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#5B4BFF] text-xs font-semibold text-white">
            {node.value}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#0F172A]">@{displayName}</span>
                <span className="h-1 w-1 rounded-full bg-[#22D3EE]" />
                <span className="text-[#475569]">
                  {new Date(node.created_at).toLocaleString()}
                </span>
              </div>
              {node.type !== 'starting' && node.operation_type && (
                <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#5B4BFF]">
                  {node.operation_type}
                </span>
              )}
            </div>
            <p className="text-sm text-[#0F172A]">
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
      <div className="flex items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] px-6 py-10 text-sm text-[#475569] bg-white/70">
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
