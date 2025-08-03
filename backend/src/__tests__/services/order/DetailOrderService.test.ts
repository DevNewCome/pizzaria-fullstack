/**
 * TESTE DO SERVIÇO DE DETALHES DO PEDIDO
 */

import { DetailOrderService } from '../../../services/order/DetailOrderService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  item: {
    findMany: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  item: {
    findMany: jest.Mock;
  };
};

describe('DetailOrderService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return order details successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const orderId = 'order-123';
    const expectedItems = [
      { id: 'item-1', name: 'Pizza', amount: 2, product: { name: 'Pizza Margherita' } }
    ];

    // Configura o mock para retornar os itens esperados
    mockPrisma.item.findMany.mockResolvedValue(expectedItems);

    // Act - Execução do serviço sendo testado
    const service = new DetailOrderService();
    const result = await service.execute({ order_id: orderId });

    // Assert - Verificação dos resultados
    // Verifica se o método findMany foi chamado com os parâmetros corretos
    expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
      where: { order_id: orderId },
      include: {
        product: true,
        order: true,
      }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedItems);
  });
}); 