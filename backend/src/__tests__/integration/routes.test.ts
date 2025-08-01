import request from 'supertest';
import express from 'express';
import { router } from '../../routes';
import { isAuth } from '../../middlewares/isAuth';

// Mock do middleware de autenticação para rotas protegidas
jest.mock('../../middlewares/isAuth', () => ({
  isAuth: jest.fn((req, res, next) => {
    req.user_id = 'test-user-id';
    next();
  }),
}));

// Mock dos serviços
jest.mock('../../services/user/CreateUserService', () => ({
  createUserService: jest.fn(),
}));

jest.mock('../../services/user/AuthUserService', () => ({
  authUserService: jest.fn(),
}));

jest.mock('../../services/category/CreateCategoryService', () => ({
  CreateCategoryService: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
}));

// Criar app Express para testes
const app = express();
app.use(express.json());
app.use(router);

describe('Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const { createUserService } = require('../../services/user/CreateUserService');
      createUserService.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com'
      });

      // Act
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(200);

      // Assert
      expect(createUserService).toHaveBeenCalledWith(userData);
      expect(response.body).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    it('should return 400 when service throws error', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const { createUserService } = require('../../services/user/CreateUserService');
      createUserService.mockRejectedValue(new Error('User already exists'));

      // Act & Assert
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({ error: 'User already exists' });
    });
  });

  describe('POST /session', () => {
    it('should authenticate user successfully', async () => {
      // Arrange
      const authData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const { authUserService } = require('../../services/user/AuthUserService');
      authUserService.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        token: 'valid-jwt-token'
      });

      // Act
      const response = await request(app)
        .post('/session')
        .send(authData)
        .expect(200);

      // Assert
      expect(authUserService).toHaveBeenCalledWith(authData);
      expect(response.body).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        token: 'valid-jwt-token'
      });
    });

    it('should return 400 when authentication fails', async () => {
      // Arrange
      const authData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const { authUserService } = require('../../services/user/AuthUserService');
      authUserService.mockRejectedValue(new Error('User/password incorrect'));

      // Act & Assert
      const response = await request(app)
        .post('/session')
        .send(authData)
        .expect(400);

      expect(response.body).toEqual({ error: 'User/password incorrect' });
    });
  });

  describe('POST /category', () => {
    it('should create category successfully with authentication', async () => {
      // Arrange
      const categoryData = {
        name: 'Pizzas'
      };

      const { CreateCategoryService } = require('../../services/category/CreateCategoryService');
      const mockExecute = jest.fn().mockResolvedValue({
        id: 'category-id',
        name: 'Pizzas'
      });
      CreateCategoryService.mockImplementation(() => ({
        execute: mockExecute
      }));

      // Act
      const response = await request(app)
        .post('/category')
        .send(categoryData)
        .expect(200);

      // Assert
      expect(isAuth).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledWith(categoryData);
      expect(response.body).toEqual({
        id: 'category-id',
        name: 'Pizzas'
      });
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON', async () => {
      // Act & Assert
      await request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should handle missing required fields', async () => {
      // Arrange
      const { createUserService } = require('../../services/user/CreateUserService');
      createUserService.mockRejectedValue(new Error('Email incorrect'));

      // Act & Assert
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User' }) // Missing email and password
        .expect(400);

      expect(response.body).toEqual({ error: 'Email incorrect' });
    });
  });
}); 