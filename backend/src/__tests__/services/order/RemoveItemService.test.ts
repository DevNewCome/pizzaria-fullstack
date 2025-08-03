/**
 * TESTE DO SERVIÇO DE REMOÇÃO DE ITEM
 */

import { RemoveItemService } from '../../../services/order/RemoveItemService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  item: {
    delete: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  item: {
    delete: jest.Mock;
  };
};

describe('RemoveItemService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove item successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const itemId = 'item-123';
    const expectedResult = { id: 'item-123', order_id: 'order-123', product_id: 'prod-123' };

    // Configura o mock para retornar o item removido
    mockPrisma.item.delete.mockResolvedValue(expectedResult);

    // Act - Execução do serviço sendo testado
    const service = new RemoveItemService();
    const result = await service.execute({ item_id: itemId });

    // Assert - Verificação dos resultados
    // Verifica se o método delete foi chamado com o ID correto
    expect(mockPrisma.item.delete).toHaveBeenCalledWith({
      where: { id: itemId }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedResult);
  });
}); 