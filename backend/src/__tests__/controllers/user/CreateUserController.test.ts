/**
 * TESTE DO CONTROLLER DE CRIAÇÃO DE USUÁRIO
 * 
 * Este arquivo testa o controller responsável por receber requisições HTTP
 * e coordenar a criação de usuários. O controller deve:
 * - Receber dados da requisição HTTP (req.body)
 * - Chamar o serviço de criação de usuário
 * - Retornar respostas HTTP apropriadas (status codes, JSON)
 * - Tratar erros e retornar mensagens de erro adequadas
 * - Garantir que a API responda corretamente em todos os cenários
 */

import { createUserController } from '../../../controllers/user/CreateUserController';
import { createUserService } from '../../../services/user/CreateUserService';
import { mockRequest, mockResponse } from '../../utils/testUtils';

// Mock do serviço - Simula o serviço de criação de usuário
jest.mock('../../../services/user/CreateUserService');
const mockCreateUserService = createUserService as jest.MockedFunction<typeof createUserService>;

describe('CreateUserController', () => {
  // Antes de cada teste, limpa todos os mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserController', () => {
    // Dados válidos que serão usados em vários testes
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    /**
     * TESTE DE SUCESSO - Criação de usuário com dados válidos
     * 
     * Este teste verifica se o controller:
     * - Recebe dados válidos da requisição
     * - Chama o serviço corretamente
     * - Retorna status 200 (sucesso)
     * - Retorna os dados do usuário criado em JSON
     * - Não chama res.status() pois 200 é o padrão
     */
    it('should create user successfully and return 200 with user data', async () => {
      // Arrange - Preparar requisição, resposta e mock do serviço
      const req = mockRequest(validUserData); // Simula req.body com dados válidos
      const res = mockResponse(); // Simula objeto response do Express
      const expectedUser = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com'
      };

      mockCreateUserService.mockResolvedValue(expectedUser); // Serviço retorna sucesso

      // Act - Executar o controller
      await createUserController(req as any, res as any);

      // Assert - Verificar se tudo funcionou corretamente
      // Verifica se o serviço foi chamado com os dados corretos
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      // Verifica se a resposta JSON foi enviada com os dados do usuário
      expect(res.json).toHaveBeenCalledWith(expectedUser);
      // Verifica que não foi definido status específico (usa 200 padrão)
      expect(res.status).not.toHaveBeenCalled();
    });

    /**
     * TESTE DE ERRO - Erro de validação do serviço
     * 
     * Este teste verifica se o controller trata erros de validação:
     * - Serviço lança erro de validação
     * - Controller deve retornar status 400 (Bad Request)
     * - Deve retornar mensagem de erro em JSON
     * - Deve chamar res.status() e res.json() corretamente
     */
    it('should return 400 when service throws validation error', async () => {
      // Arrange - Preparar para erro de validação
      const req = mockRequest(validUserData);
      const res = mockResponse();
      const errorMessage = 'Email incorrect';

      mockCreateUserService.mockRejectedValue(new Error(errorMessage)); // Serviço falha

      // Act - Executar o controller
      await createUserController(req as any, res as any);

      // Assert - Verificar se o erro foi tratado corretamente
      // Verifica se o serviço foi chamado
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      // Verifica se o status 400 foi definido
      expect(res.status).toHaveBeenCalledWith(400);
      // Verifica se a mensagem de erro foi retornada em JSON
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    /**
     * TESTE DE ERRO - Usuário já existe
     * 
     * Este teste verifica se o controller trata quando o usuário já existe:
     * - Serviço lança erro "User already exists"
     * - Controller deve retornar status 400
     * - Deve retornar mensagem de erro específica
     */
    it('should return 400 when user already exists', async () => {
      // Arrange - Preparar para erro de usuário já existente
      const req = mockRequest(validUserData);
      const res = mockResponse();
      const errorMessage = 'User already exists';

      mockCreateUserService.mockRejectedValue(new Error(errorMessage)); // Usuário já existe

      // Act - Executar o controller
      await createUserController(req as any, res as any);

      // Assert - Verificar se o erro foi tratado corretamente
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    /**
     * TESTE DE ERRO - Campos obrigatórios faltando
     * 
     * Este teste verifica se o controller trata dados incompletos:
     * - Requisição com campos obrigatórios faltando
     * - Serviço deve rejeitar e lançar erro
     * - Controller deve retornar status 400
     * - Deve retornar mensagem de erro apropriada
     */
    it('should handle missing required fields gracefully', async () => {
      // Arrange - Preparar dados incompletos
      const invalidUserData = {
        name: 'Test User',
        // email missing - campo obrigatório faltando
        password: 'password123'
      };
      const req = mockRequest(invalidUserData);
      const res = mockResponse();

      mockCreateUserService.mockRejectedValue(new Error('Email incorrect')); // Serviço rejeita

      // Act - Executar o controller
      await createUserController(req as any, res as any);

      // Assert - Verificar se o erro foi tratado corretamente
      expect(mockCreateUserService).toHaveBeenCalledWith(invalidUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email incorrect' });
    });

    /**
     * TESTE DE ERRO - Problemas de banco de dados
     * 
     * Este teste verifica se o controller trata erros de banco:
     * - Serviço falha por problema de banco
     * - Controller deve retornar status 400
     * - Deve propagar a mensagem de erro do banco
     * - Garante que erros técnicos são tratados adequadamente
     */
    it('should handle database errors gracefully', async () => {
      // Arrange - Preparar para erro de banco de dados
      const req = mockRequest(validUserData);
      const res = mockResponse();
      const errorMessage = 'Database connection failed';

      mockCreateUserService.mockRejectedValue(new Error(errorMessage)); // Erro de banco

      // Act - Executar o controller
      await createUserController(req as any, res as any);

      // Assert - Verificar se o erro foi tratado corretamente
      expect(mockCreateUserService).toHaveBeenCalledWith(validUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
}); 