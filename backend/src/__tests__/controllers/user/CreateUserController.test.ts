import { createUserController } from '../../../controllers/user/CreateUserController';
import { createUserService } from '../../../services/user/CreateUserService';
import { mockRequest, mockResponse } from '../../utils/testUtils';

// Mock do serviço
jest.mock('../../../services/user/CreateUserService');
const mockCreateUserService = createUserService as jest.MockedFunction<typeof createUserService>;

describe('CreateUserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserController', () => {
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should create user successfully and return 200 with user data', async () => {
      // Arrange
      const req = mockRequest(validUserData);
      const res = mockResponse();
      const expectedUser = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com'
      };

      mockCreateUserService.mockResolvedValue(expectedUser);

      // Act
      await createUserController(req as any, res as any);

      // Assert
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      expect(res.json).toHaveBeenCalledWith(expectedUser);
      expect(res.status).not.toHaveBeenCalled(); // Should return 200 by default
    });

    it('should return 400 when service throws validation error', async () => {
      // Arrange
      const req = mockRequest(validUserData);
      const res = mockResponse();
      const errorMessage = 'Email incorrect';

      mockCreateUserService.mockRejectedValue(new Error(errorMessage));

      // Act
      await createUserController(req as any, res as any);

      // Assert
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return 400 when user already exists', async () => {
      // Arrange
      const req = mockRequest(validUserData);
      const res = mockResponse();
      const errorMessage = 'User already exists';

      mockCreateUserService.mockRejectedValue(new Error(errorMessage));

      // Act
      await createUserController(req as any, res as any);

      // Assert
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle missing required fields gracefully', async () => {
      // Arrange
      const invalidUserData = {
        name: 'Test User',
        // email missing
        password: 'password123'
      };
      const req = mockRequest(invalidUserData);
      const res = mockResponse();

      mockCreateUserService.mockRejectedValue(new Error('Email incorrect'));

      // Act
      await createUserController(req as any, res as any);

      // Assert
      expect(mockCreateUserService).toHaveBeenCalledWith(invalidUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email incorrect' });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const req = mockRequest(validUserData);
      const res = mockResponse();
      const errorMessage = 'Database connection failed';

      mockCreateUserService.mockRejectedValue(new Error(errorMessage));

      // Act
      await createUserController(req as any, res as any);

      // Assert
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
}); 