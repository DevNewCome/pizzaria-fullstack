/**
 * TESTE DO CONTROLLER DE CRIAÇÃO DE PEDIDO
 */

import { CreateOrderController } from 'controllers/order/CreateOrderController';
import { CreateOrderService } from 'services/order/CreateOrderService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de criação de pedido para isolar os testes
jest.mock('services/order/CreateOrderService');
const mockCreateOrderService = CreateOrderService as jest.MockedClass<typeof CreateOrderService>;

describe('CreateOrderController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const orderData = { table: 5, name: 'Mesa 5' };
    const req = mockRequest(orderData);
    const res = mockResponse();
    const expectedOrder = {
      id: 'order-123',
      table: 5,
      name: 'Mesa 5',
      status: false,
      draft: true
    };

    // Configura o mock do serviço para retornar o pedido esperado
    mockCreateOrderService.prototype.execute = jest.fn().mockResolvedValue(expectedOrder);

    // Act - Execução do controller sendo testado
    const controller = new CreateOrderController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com os dados corretos
    expect(mockCreateOrderService.prototype.execute).toHaveBeenCalledWith(orderData);
    // Verifica se a resposta JSON foi enviada com o pedido criado
    expect(res.json).toHaveBeenCalledWith(expectedOrder);
  });

  it('should handle service errors', async () => {
    // Arrange - Preparação dos dados de teste (dados inválidos)
    const orderData = { table: 0, name: '' };
    const req = mockRequest(orderData);
    const res = mockResponse();

    // Configura o mock do serviço para simular um erro
    mockCreateOrderService.prototype.execute = jest.fn().mockRejectedValue(new Error('Invalid table'));

    // Act & Assert - Verificação do tratamento de erro
    const controller = new CreateOrderController();
    // Verifica se o erro do serviço é propagado pelo controller
    await expect(controller.handle(req as any, res as any)).rejects.toThrow('Invalid table');
  });
}); 