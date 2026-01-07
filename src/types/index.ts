export interface OperationNode {
  id: number;
  type: 'starting' | 'operation';
  user_id: number;
  // optional username coming from the API; falls back to user_id in the UI
  username?: string;
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
