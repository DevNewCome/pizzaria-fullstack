/**
 * TESTE DO SERVIÇO DE REMOÇÃO DE PEDIDO
 */

import { RemoveOrderService } from '../../../services/order/RemoveOrderService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  order: {
    delete: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  order: {
    delete: jest.Mock;
  };
};

describe('RemoveOrderService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const orderId = 'order-123';
    const expectedResult = { id: 'order-123', table: 5, name: 'Mesa 5' };

    // Configura o mock para retornar o pedido removido
    mockPrisma.order.delete.mockResolvedValue(expectedResult);

    // Act - Execução do serviço sendo testado
    const service = new RemoveOrderService();
    const result = await service.execute({ order_id: orderId });

    // Assert - Verificação dos resultados
    // Verifica se o método delete foi chamado com o ID correto
    expect(mockPrisma.order.delete).toHaveBeenCalledWith({
      where: { id: orderId }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedResult);
  });
}); 