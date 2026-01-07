import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../AuthModal';
import * as authApi from '../../api/auth';

jest.mock('../../api/auth');

describe('AuthModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form when mode is login', () => {
    render(
      <AuthModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        mode="login"
      />
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders register form when mode is register', () => {
    render(
      <AuthModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        mode="register"
      />
    );

    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('calls login API when submitting login form', async () => {
    const mockLogin = authApi.login as jest.Mock;
    mockLogin.mockResolvedValue({
      token: 'test-token',
      user: { id: 1, username: 'testuser' },
    });

    render(
      <AuthModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        mode="login"
      />
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on login failure', async () => {
    const mockLogin = authApi.login as jest.Mock;
    mockLogin.mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });

    render(
      <AuthModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        mode="login"
      />
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
