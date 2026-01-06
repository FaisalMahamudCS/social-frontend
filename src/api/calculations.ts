import apiClient from './client';
import { OperationNode } from '../types';

export interface CreateStartingNumberData {
  number: number;
}

export interface CreateOperationData {
  parent_id: number;
  parent_type: 'starting' | 'operation';
  operation_type: 'add' | 'subtract' | 'multiply' | 'divide';
  right_operand: number;
}

export const getCalculationTree = async (): Promise<OperationNode[]> => {
  const response = await apiClient.get<OperationNode[]>('/calculations');
  return response.data;
};

export const createStartingNumber = async (data: CreateStartingNumberData) => {
  const response = await apiClient.post('/calculations/starting', data);
  return response.data;
};

export const createOperation = async (data: CreateOperationData) => {
  const response = await apiClient.post('/calculations/operation', data);
  return response.data;
};
