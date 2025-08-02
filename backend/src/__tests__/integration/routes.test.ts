/**
 * TESTES DE INTEGRAÇÃO DAS ROTAS
 * 
 * Este arquivo testa as rotas HTTP de forma integrada, simulando
 * requisições reais do cliente. Os testes verificam:
 * - Se as rotas respondem corretamente a requisições HTTP
 * - Se os status codes estão corretos (200, 400, 401, etc.)
 * - Se o corpo da resposta (JSON) está correto
 * - Se a autenticação funciona em rotas protegidas
 * - Se os serviços são chamados com os dados corretos
 * - Se erros são tratados adequadamente
 */

import request from 'supertest';
import express from 'express';
import { router } from '../../routes';
import { isAuth } from '../../middlewares/isAuth';

// Mock do middleware de autenticação para rotas protegidas
// Simula que o usuário está sempre autenticado nos testes
jest.mock('../../middlewares/isAuth', () => ({
  isAuth: jest.fn((req, res, next) => {
    req.user_id = 'test-user-id'; // Adiciona ID do usuário à requisição
    next(); // Permite acesso à rota
  }),
}));

// Mock dos serviços - Simula os serviços sem fazer operações reais
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

// Criar app Express para testes - Simula o servidor real
const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.use(router); // Adiciona as rotas ao app

describe('Routes Integration Tests', () => {
  // Antes de cada teste, limpa todos os mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TESTES DA ROTA POST /users - Criação de usuário
   * 
   * Esta seção testa a rota que permite criar novos usuários no sistema.
   * Verifica se a API responde corretamente tanto em casos de sucesso quanto de erro.
   */
  describe('POST /users', () => {
    /**
     * TESTE DE SUCESSO - Criação de usuário com dados válidos
     * 
     * Este teste verifica se a rota:
     * - Aceita requisição POST com dados JSON válidos
     * - Chama o serviço de criação com os dados corretos
     * - Retorna status 200 (sucesso)
     * - Retorna os dados do usuário criado em JSON
     * - Não retorna a senha na resposta (por segurança)
     */
    it('should create user successfully', async () => {
      // Arrange - Preparar dados e mock do serviço
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

      // Act - Fazer requisição HTTP real
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(200); // Espera status 200

      // Assert - Verificar se tudo funcionou corretamente
      // Verifica se o serviço foi chamado com os dados corretos
      expect(createUserService).toHaveBeenCalledWith(userData);
      // Verifica se a resposta JSON está correta
      expect(response.body).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    /**
     * TESTE DE ERRO - Serviço lança erro
     * 
     * Este teste verifica se a rota trata erros do serviço:
     * - Serviço falha (ex: usuário já existe)
     * - Rota deve retornar status 400 (Bad Request)
     * - Deve retornar mensagem de erro em JSON
     * - Garante que erros são propagados corretamente
     */
    it('should return 400 when service throws error', async () => {
      // Arrange - Preparar para erro do serviço
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const { createUserService } = require('../../services/user/CreateUserService');
      createUserService.mockRejectedValue(new Error('User already exists')); // Serviço falha

      // Act & Assert - Fazer requisição e verificar erro
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400); // Espera status 400

      // Verifica se a mensagem de erro está correta
      expect(response.body).toEqual({ error: 'User already exists' });
    });
  });

  /**
   * TESTES DA ROTA POST /session - Autenticação de usuário
   * 
   * Esta seção testa a rota que permite usuários fazerem login no sistema.
   * Verifica se a autenticação funciona corretamente e retorna o token JWT.
   */
  describe('POST /session', () => {
    /**
     * TESTE DE SUCESSO - Autenticação com credenciais válidas
     * 
     * Este teste verifica se a rota:
     * - Aceita email e senha para autenticação
     * - Chama o serviço de autenticação corretamente
     * - Retorna status 200 (sucesso)
     * - Retorna dados do usuário + token JWT
     * - Token pode ser usado para acessar rotas protegidas
     */
    it('should authenticate user successfully', async () => {
      // Arrange - Preparar dados de autenticação e mock
      const authData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const { authUserService } = require('../../services/user/AuthUserService');
      authUserService.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        token: 'valid-jwt-token' // Token JWT para autenticação
      });

      // Act - Fazer requisição de autenticação
      const response = await request(app)
        .post('/session')
        .send(authData)
        .expect(200);

      // Assert - Verificar se a autenticação funcionou
      // Verifica se o serviço foi chamado com os dados corretos
      expect(authUserService).toHaveBeenCalledWith(authData);
      // Verifica se retornou dados do usuário + token
      expect(response.body).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        token: 'valid-jwt-token'
      });
    });

    /**
     * TESTE DE ERRO - Falha na autenticação
     * 
     * Este teste verifica se a rota trata falhas de autenticação:
     * - Credenciais inválidas (email ou senha errados)
     * - Deve retornar status 400
     * - Deve retornar mensagem de erro apropriada
     * - Não deve retornar token JWT
     */
    it('should return 400 when authentication fails', async () => {
      // Arrange - Preparar credenciais inválidas
      const authData = {
        email: 'test@example.com',
        password: 'wrongpassword' // Senha incorreta
      };

      const { authUserService } = require('../../services/user/AuthUserService');
      authUserService.mockRejectedValue(new Error('User/password incorrect')); // Autenticação falha

      // Act & Assert - Verificar se o erro foi tratado
      const response = await request(app)
        .post('/session')
        .send(authData)
        .expect(400);

      // Verifica se a mensagem de erro está correta
      expect(response.body).toEqual({ error: 'User/password incorrect' });
    });
  });

  /**
   * TESTES DA ROTA POST /category - Criação de categoria
   * 
   * Esta seção testa uma rota protegida que requer autenticação.
   * Verifica se a autenticação funciona e se a categoria é criada corretamente.
   */
  describe('POST /category', () => {
    /**
     * TESTE DE SUCESSO - Criação de categoria com autenticação
     * 
     * Este teste verifica se a rota protegida:
     * - Requer autenticação (middleware isAuth é chamado)
     * - Aceita dados da categoria
     * - Chama o serviço de criação de categoria
     * - Retorna status 200 e dados da categoria criada
     * - Funciona corretamente com usuário autenticado
     */
    it('should create category successfully with authentication', async () => {
      // Arrange - Preparar dados da categoria e mock
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

      // Act - Fazer requisição para rota protegida
      const response = await request(app)
        .post('/category')
        .send(categoryData)
        .expect(200);

      // Assert - Verificar se tudo funcionou
      // Verifica se o middleware de autenticação foi chamado
      expect(isAuth).toHaveBeenCalled();
      // Verifica se o serviço foi chamado com os dados corretos
      expect(mockExecute).toHaveBeenCalledWith(categoryData);
      // Verifica se a resposta está correta
      expect(response.body).toEqual({
        id: 'category-id',
        name: 'Pizzas'
      });
    });
  });

  /**
   * TESTES DE TRATAMENTO DE ERROS
   * 
   * Esta seção testa como a API trata diferentes tipos de erros
   * e dados malformados que podem ser enviados pelos clientes.
   */
  describe('Error handling', () => {
    /**
     * TESTE DE ERRO - JSON malformado
     * 
     * Este teste verifica se a API trata requisições com JSON inválido:
     * - Cliente envia JSON malformado
     * - Deve retornar status 400
     * - Deve tratar o erro de parsing do JSON
     * - Garante que a API não quebra com dados inválidos
     */
    it('should handle malformed JSON', async () => {
      // Act & Assert - Enviar JSON inválido e verificar erro
      await request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send('invalid json') // JSON malformado
        .expect(400);
    });

    /**
     * TESTE DE ERRO - Campos obrigatórios faltando
     * 
     * Este teste verifica se a API trata dados incompletos:
     * - Cliente não envia todos os campos obrigatórios
     * - Serviço deve rejeitar e lançar erro
     * - API deve retornar status 400 com mensagem de erro
     * - Garante validação adequada dos dados de entrada
     */
    it('should handle missing required fields', async () => {
      // Arrange - Preparar mock para erro de validação
      const { createUserService } = require('../../services/user/CreateUserService');
      createUserService.mockRejectedValue(new Error('Email incorrect'));

      // Act & Assert - Enviar dados incompletos e verificar erro
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User' }) // Faltando email e password
        .expect(400);

      // Verifica se a mensagem de erro está correta
      expect(response.body).toEqual({ error: 'Email incorrect' });
    });
  });
}); 