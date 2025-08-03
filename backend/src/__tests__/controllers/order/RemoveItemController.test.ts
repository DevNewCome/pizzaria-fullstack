/**
 * TESTE DO CONTROLLER DE REMOÇÃO DE ITEM
 */

import { RemoveItemController } from 'controllers/order/RemoveItemController';
import { RemoveItemService } from 'services/order/RemoveItemService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de remoção de item para isolar os testes
jest.mock('services/order/RemoveItemService');
const mockRemoveItemService = RemoveItemService as jest.MockedClass<typeof RemoveItemService>;

describe('RemoveItemController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove item successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest({}, {});
    req.query = { item_id: 'item-123' };
    const res = mockResponse();
    const expectedResult = { id: 'item-123', order_id: 'order-123', product_id: 'prod-123' };

    // Configura o mock do serviço para retornar o item removido
    mockRemoveItemService.prototype.execute = jest.fn().mockResolvedValue(expectedResult);

    // Act - Execução do controller sendo testado
    const controller = new RemoveItemController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com o ID do item correto
    expect(mockRemoveItemService.prototype.execute).toHaveBeenCalledWith({ item_id: 'item-123' });
    // Verifica se a resposta JSON foi enviada com o resultado da remoção
    expect(res.json).toHaveBeenCalledWith(expectedResult);
  });
}); 