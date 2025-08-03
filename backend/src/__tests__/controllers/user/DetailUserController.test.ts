/**
 * TESTE DO CONTROLLER DE DETALHES DO USUÁRIO
 * 
 * Este controller busca e retorna os dados do usuário autenticado
 * usando o user_id que vem do middleware de autenticação.
 */

import { DetailUserController } from 'controllers/user/DetailUserController';
import { DetailUserService } from 'services/user/DetailUserService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de detalhes do usuário para isolar os testes
jest.mock('services/user/DetailUserService');
const mockDetailUserService = DetailUserService as jest.MockedClass<typeof DetailUserService>;

describe('DetailUserController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user details successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest({}, {});
    req.user_id = 'user-123';
    const res = mockResponse();
    const expectedUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com'
    };

    // Configura o mock do serviço para retornar o usuário esperado
    mockDetailUserService.prototype.execute = jest.fn().mockResolvedValue(expectedUser);

    // Act - Execução do controller sendo testado
    const controller = new DetailUserController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com o ID do usuário correto
    expect(mockDetailUserService.prototype.execute).toHaveBeenCalledWith('user-123');
    // Verifica se a resposta JSON foi enviada com os detalhes do usuário
    expect(res.json).toHaveBeenCalledWith(expectedUser);
  });

  it('should handle service errors', async () => {
    // Arrange - Preparação dos dados de teste (usuário não encontrado)
    const req = mockRequest({}, {});
    req.user_id = 'user-123';
    const res = mockResponse();

    // Configura o mock do serviço para simular um erro
    mockDetailUserService.prototype.execute = jest.fn().mockRejectedValue(new Error('User not found'));

    // Act & Assert - Verificação do tratamento de erro
    const controller = new DetailUserController();
    // Verifica se o erro do serviço é propagado pelo controller
    await expect(controller.handle(req as any, res as any)).rejects.toThrow('User not found');
  });
}); 