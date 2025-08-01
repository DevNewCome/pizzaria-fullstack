import { isAuth } from '../../../middlewares/isAuth';
import { verify } from 'jsonwebtoken';
import { mockRequest, mockResponse, mockNext } from '../utils/testUtils';

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const mockVerify = verify as jest.MockedFunction<typeof verify>;

describe('isAuth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('isAuth', () => {
    it('should call next() when valid token is provided', () => {
      // Arrange
      const token = 'valid-jwt-token';
      const req = mockRequest({}, { authorization: `Bearer ${token}` });
      const res = mockResponse();
      const next = mockNext;

      mockVerify.mockReturnValue({ sub: 'user-id' } as any);

      // Act
      isAuth(req as any, res as any, next);

      // Assert
      expect(mockVerify).toHaveBeenCalledWith(token, 'test-secret');
      expect(req.user_id).toBe('user-id');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
    });

    it('should return 401 when no authorization header is provided', () => {
      // Arrange
      const req = mockRequest({}, {});
      const res = mockResponse();
      const next = mockNext;

      // Act
      isAuth(req as any, res as any, next);

      // Assert
      expect(mockVerify).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    it('should return 401 when authorization header is empty', () => {
      // Arrange
      const req = mockRequest({}, { authorization: '' });
      const res = mockResponse();
      const next = mockNext;

      // Act
      isAuth(req as any, res as any, next);

      // Assert
      expect(mockVerify).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    it('should return 401 when token format is invalid (no Bearer)', () => {
      // Arrange
      const req = mockRequest({}, { authorization: 'invalid-token' });
      const res = mockResponse();
      const next = mockNext;

      // Act
      isAuth(req as any, res as any, next);

      // Assert
      expect(mockVerify).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    it('should return 401 when token verification fails', () => {
      // Arrange
      const token = 'invalid-jwt-token';
      const req = mockRequest({}, { authorization: `Bearer ${token}` });
      const res = mockResponse();
      const next = mockNext;

      mockVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      isAuth(req as any, res as any, next);

      // Assert
      expect(mockVerify).toHaveBeenCalledWith(token, 'test-secret');
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle token with extra spaces', () => {
      // Arrange
      const token = 'valid-jwt-token';
      const req = mockRequest({}, { authorization: `  Bearer  ${token}  ` });
      const res = mockResponse();
      const next = mockNext;

      mockVerify.mockReturnValue({ sub: 'user-id' } as any);

      // Act
      isAuth(req as any, res as any, next);

      // Assert
      expect(mockVerify).toHaveBeenCalledWith(token, 'test-secret');
      expect(req.user_id).toBe('user-id');
      expect(next).toHaveBeenCalled();
    });

    it('should set user_id correctly when token is valid', () => {
      // Arrange
      const token = 'valid-jwt-token';
      const req = mockRequest({}, { authorization: `Bearer ${token}` });
      const res = mockResponse();
      const next = mockNext;

      mockVerify.mockReturnValue({ sub: 'test-user-123' } as any);

      // Act
      isAuth(req as any, res as any, next);

      // Assert
      expect(req.user_id).toBe('test-user-123');
      expect(next).toHaveBeenCalled();
    });
  });
}); 