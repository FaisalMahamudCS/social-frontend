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
      return `Starting: ${node.value}`;
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
    return (
      <div key={node.id} className="tree-node" style={{ marginLeft: `${depth * 20}px` }}>
        <div className="node-content">
          <span className="node-value">{node.value}</span>
          <span className="node-operation">{formatOperation(node)}</span>
        </div>
        <div className="node-meta">
          {new Date(node.created_at).toLocaleString()}
        </div>
        {isAuthenticated && (
          <CreateOperationForm
            parentId={node.id}
            parentType={node.type}
            onOperationCreated={onOperationCreated}
          />
        )}
        {node.children.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (nodes.length === 0) {
    return (
      <div className="empty-state">
        <p>No calculations yet. Be the first to start a chain!</p>
      </div>
    );
  }

  return (
    <div>
      {nodes.map((node) => renderNode(node))}
    </div>
  );
};

export default CalculationTree;
