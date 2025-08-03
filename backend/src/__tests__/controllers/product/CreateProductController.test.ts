/**
 * TESTE DO CONTROLLER DE CRIAÇÃO DE PRODUTO
 */

import { CreateProductController } from 'controllers/product/CreateProductController';
import { CreateProductService } from 'services/product/CreateProductService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de criação de produto para isolar os testes
jest.mock('services/product/CreateProductService');
const mockCreateProductService = CreateProductService as jest.MockedClass<typeof CreateProductService>;

describe('CreateProductController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create product successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const productData = {
      name: 'Pizza Margherita',
      price: '25.90',
      description: 'Pizza tradicional',
      category_id: 'cat-123'
    };
    const req = mockRequest(productData);
    req.file = {
      originalname: 'pizza.jpg',
      filename: 'pizza-123.jpg'
    } as any;
    const res = mockResponse();
    const expectedProduct = {
      id: 'prod-123',
      name: 'Pizza Margherita',
      price: '25.90',
      banner: 'pizza-123.jpg'
    };

    // Configura o mock do serviço para retornar o produto criado
    mockCreateProductService.prototype.execute = jest.fn().mockResolvedValue(expectedProduct);

    // Act - Execução do controller sendo testado
    const controller = new CreateProductController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com os dados corretos incluindo o banner
    expect(mockCreateProductService.prototype.execute).toHaveBeenCalledWith({
      ...productData,
      banner: 'pizza-123.jpg'
    });
    // Verifica se a resposta JSON foi enviada com o produto criado
    expect(res.json).toHaveBeenCalledWith(expectedProduct);
  });

  it('should throw error when no file is uploaded', async () => {
    // Arrange - Preparação dos dados de teste (sem arquivo)
    const productData = { name: 'Pizza', price: '25.90' };
    const req = mockRequest(productData);
    req.file = undefined;
    const res = mockResponse();

    // Act & Assert - Verificação do tratamento de erro
    const controller = new CreateProductController();
    // Verifica se o erro é lançado quando não há arquivo enviado
    await expect(controller.handle(req as any, res as any)).rejects.toThrow('error upload file');
  });

  it('should handle service errors', async () => {
    // Arrange - Preparação dos dados de teste (dados inválidos)
    const productData = { name: 'Pizza', price: '25.90' };
    const req = mockRequest(productData);
    req.file = { originalname: 'pizza.jpg', filename: 'pizza.jpg' } as any;
    const res = mockResponse();

    // Configura o mock do serviço para simular um erro
    mockCreateProductService.prototype.execute = jest.fn().mockRejectedValue(new Error('Invalid data'));

    // Act & Assert - Verificação do tratamento de erro
    const controller = new CreateProductController();
    // Verifica se o erro do serviço é propagado pelo controller
    await expect(controller.handle(req as any, res as any)).rejects.toThrow('Invalid data');
  });
}); 