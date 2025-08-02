/**
 * UTILITÁRIOS PARA TESTES
 * 
 * Este arquivo contém funções auxiliares que facilitam a criação de testes,
 * fornecendo mocks e helpers comuns usados em vários arquivos de teste.
 * 
 * As funções incluem:
 * - Geração de tokens JWT para testes de autenticação
 * - Mock de objetos Request do Express
 * - Mock de objetos Response do Express
 * - Mock da função next() do Express
 */

import { sign } from 'jsonwebtoken';
import { Request } from 'express';

/**
 * Gera um token JWT válido para testes de autenticação
 * 
 * Esta função cria um token JWT que pode ser usado em testes que
 * precisam simular um usuário autenticado. O token contém dados
 * de teste e expira em 1 hora.
 * 
 * @param userId - ID do usuário para incluir no token (padrão: 'test-user-id')
 * @returns String contendo o token JWT
 * 
 * Exemplo de uso:
 * const token = generateTestToken('user-123');
 * const req = mockRequest({}, { authorization: `Bearer ${token}` });
 */
export const generateTestToken = (userId: string = 'test-user-id'): string => {
  return sign(
    {
      name: 'Test User',
      email: 'test@example.com'
    },
    process.env.JWT_SECRET || 'test-secret', // Usa chave secreta de teste
    {
      subject: userId, // ID do usuário no token
      expiresIn: '1h'  // Token válido por 1 hora
    }
  );
};

/**
 * Cria um mock do objeto Request do Express
 * 
 * Esta função simula um objeto Request do Express com dados de teste,
 * permitindo testar controllers e middlewares sem fazer requisições HTTP reais.
 * 
 * @param body - Dados do corpo da requisição (req.body)
 * @param headers - Headers da requisição (req.headers)
 * @returns Objeto Request mockado
 * 
 * Exemplo de uso:
 * const req = mockRequest({ name: 'John' }, { authorization: 'Bearer token' });
 */
export const mockRequest = (body: any = {}, headers: any = {}): Partial<Request> => {
  return {
    body, // Dados do corpo da requisição
    headers: {
      'Content-Type': 'application/json', // Content-Type padrão
      ...headers // Headers adicionais (ex: Authorization)
    }
  } as Partial<Request>;
};

/**
 * Cria um mock do objeto Response do Express
 * 
 * Esta função simula um objeto Response do Express com métodos mockados,
 * permitindo verificar se os controllers chamam res.status() e res.json()
 * com os valores corretos.
 * 
 * @returns Objeto Response mockado com métodos jest.fn()
 * 
 * Exemplo de uso:
 * const res = mockResponse();
 * await controller(req, res);
 * expect(res.status).toHaveBeenCalledWith(200);
 * expect(res.json).toHaveBeenCalledWith({ success: true });
 */
export const mockResponse = () => {
  const res: any = {};
  // Mock do método status() que retorna o próprio objeto (para chaining)
  res.status = jest.fn().mockReturnValue(res);
  // Mock do método json() que retorna o próprio objeto (para chaining)
  res.json = jest.fn().mockReturnValue(res);
  // Mock do método end() que retorna o próprio objeto (para chaining)
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock da função next() do Express
 * 
 * Esta função simula a função next() do Express, que é chamada
 * pelos middlewares para passar o controle para o próximo middleware
 * ou finalizar a requisição.
 * 
 * @returns Função mock do Jest
 * 
 * Exemplo de uso:
 * const next = mockNext;
 * middleware(req, res, next);
 * expect(next).toHaveBeenCalled(); // Verifica se next() foi chamado
 */
export const mockNext = jest.fn(); 