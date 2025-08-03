/**
 * TESTE DO CONTROLLER DE AUTENTICAÇÃO
 * 
 * Este controller recebe email e senha e retorna dados do usuário + token JWT
 */

import { AuthUserController } from 'controllers/user/AuthUserController';
import { authUserService } from 'services/user/AuthUserService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de autenticação para isolar os testes
jest.mock('services/user/AuthUserService');
const mockAuthUserService = authUserService as jest.MockedFunction<typeof authUserService>;

describe('AuthUserController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should authenticate user successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const authData = { email: 'test@example.com', password: 'password123' };
    const req = mockRequest(authData);
    const res = mockResponse();
    const expectedAuth = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      token: 'jwt-token'
    };

    // Configura o mock do serviço para retornar a autenticação bem-sucedida
    mockAuthUserService.mockResolvedValue(expectedAuth);

    // Act - Execução do controller sendo testado
    const controller = new AuthUserController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com os dados de autenticação corretos
    expect(mockAuthUserService).toHaveBeenCalledWith(authData);
    // Verifica se a resposta JSON foi enviada com os dados do usuário e token
    expect(res.json).toHaveBeenCalledWith(expectedAuth);
  });

  it('should return 400 when authentication fails', async () => {
    // Arrange - Preparação dos dados de teste (credenciais inválidas)
    const authData = { email: 'test@example.com', password: 'wrong' };
    const req = mockRequest(authData);
    const res = mockResponse();

    // Configura o mock do serviço para simular falha na autenticação
    mockAuthUserService.mockRejectedValue(new Error('Invalid credentials'));

    // Act - Execução do controller sendo testado
    const controller = new AuthUserController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação do tratamento de erro
    // Verifica se o status 400 foi retornado para credenciais inválidas
    expect(res.status).toHaveBeenCalledWith(400);
    // Verifica se a mensagem de erro foi enviada no JSON
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });
}); 