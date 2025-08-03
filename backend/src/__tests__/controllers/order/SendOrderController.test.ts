/**
 * TESTE DO CONTROLLER DE ENVIO DE PEDIDO
 */

import { SendOrderController } from 'controllers/order/SendOrderController';
import { SendOrderService } from 'services/order/SendOrderService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de envio de pedido para isolar os testes
jest.mock('services/order/SendOrderService');
const mockSendOrderService = SendOrderService as jest.MockedClass<typeof SendOrderService>;

describe('SendOrderController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest({ order_id: 'order-123' });
    const res = mockResponse();
    const expectedOrder = { id: 'order-123', draft: false };

    // Configura o mock do serviço para retornar o pedido enviado
    mockSendOrderService.prototype.execute = jest.fn().mockResolvedValue(expectedOrder);

    // Act - Execução do controller sendo testado
    const controller = new SendOrderController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com o ID do pedido correto
    expect(mockSendOrderService.prototype.execute).toHaveBeenCalledWith({ order_id: 'order-123' });
    // Verifica se a resposta JSON foi enviada com o pedido enviado
    expect(res.json).toHaveBeenCalledWith(expectedOrder);
  });
}); 