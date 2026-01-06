export interface OperationNode {
  id: number;
  type: 'starting' | 'operation';
  user_id: number;
  value: number;
  operation_type?: 'add' | 'subtract' | 'multiply' | 'divide';
  right_operand?: number;
  created_at: string;
  children: OperationNode[];
}

export interface User {
  id: number;
  username: string;
}
