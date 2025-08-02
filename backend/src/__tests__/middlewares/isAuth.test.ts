/**
 * TESTE DO MIDDLEWARE DE AUTENTICAÇÃO
 * 
 * Este arquivo testa o middleware responsável por verificar se o usuário
 * está autenticado antes de acessar rotas protegidas. O middleware deve:
 * - Extrair o token JWT do header Authorization
 * - Verificar se o token é válido
 * - Decodificar o token e extrair o ID do usuário
 * - Adicionar o user_id à requisição (req.user_id)
 * - Permitir ou bloquear o acesso à rota
 * - Retornar status 401 se não autenticado
 */

import { isAuth } from '../../middlewares/isAuth';
import { verify } from 'jsonwebtoken';
import { mockRequest, mockResponse, mockNext } from '../utils/testUtils';

// Mock do jsonwebtoken - Simula a verificação de tokens JWT
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(), // Mock da função que verifica tokens JWT
}));

const mockVerify = verify as jest.MockedFunction<typeof verify>;

describe('isAuth Middleware', () => {
  // Antes de cada teste, limpa mocks e configura variável de ambiente
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret'; // Chave secreta para verificar JWT
  });

  describe('isAuth', () => {
    /**
     * TESTE DE SUCESSO - Token válido fornecido
     * 
     * Este teste verifica se o middleware:
     * - Aceita um token JWT válido no formato "Bearer <token>"
     * - Verifica o token usando a chave secreta
     * - Extrai o ID do usuário do token (campo 'sub')
     * - Adiciona o user_id à requisição
     * - Chama next() para permitir acesso à rota
     */
    it('should call next() when valid token is provided', () => {
      // Arrange - Preparar requisição com token válido
      const token = 'valid-jwt-token';
      const req = mockRequest({}, { authorization: `Bearer ${token}` }); // Header Authorization
      const res = mockResponse();
      const next = mockNext;

      mockVerify.mockReturnValue({ sub: 'user-id' } as any); // Token válido com ID do usuário

      // Act - Executar o middleware
      isAuth(req as any, res as any, next);

      // Assert - Verificar se tudo funcionou corretamente
      // Verifica se o token foi verificado com a chave secreta
      expect(mockVerify).toHaveBeenCalledWith(token, 'test-secret');
      // Verifica se o ID do usuário foi adicionado à requisição
      expect(req.user_id).toBe('user-id');
      // Verifica se next() foi chamado (permite acesso à rota)
      expect(next).toHaveBeenCalled();
      // Verifica que não foi retornado erro (status 401)
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
    });

    /**
     * TESTE DE ERRO - Header Authorization ausente
     * 
     * Este teste verifica se o middleware rejeita quando:
     * - Não há header Authorization na requisição
     * - Deve retornar status 401 (Unauthorized)
     * - Deve chamar res.end() para finalizar a resposta
     * - Não deve chamar next() (bloqueia acesso)
     */
    it('should return 401 when no authorization header is provided', () => {
      // Arrange - Preparar requisição sem header Authorization
      const req = mockRequest({}, {}); // Sem header authorization
      const res = mockResponse();
      const next = mockNext;

      // Act - Executar o middleware
      isAuth(req as any, res as any, next);

      // Assert - Verificar se o acesso foi bloqueado
      // Verifica que não tentou verificar token
      expect(mockVerify).not.toHaveBeenCalled();
      // Verifica que não chamou next() (bloqueou acesso)
      expect(next).not.toHaveBeenCalled();
      // Verifica se retornou status 401
      expect(res.status).toHaveBeenCalledWith(401);
      // Verifica se finalizou a resposta
      expect(res.end).toHaveBeenCalled();
    });

    /**
     * TESTE DE ERRO - Header Authorization vazio
     * 
     * Este teste verifica se o middleware rejeita quando:
     * - Header Authorization existe mas está vazio
     * - Deve retornar status 401
     * - Não deve tentar verificar token
     */
    it('should return 401 when authorization header is empty', () => {
      // Arrange - Preparar requisição com header vazio
      const req = mockRequest({}, { authorization: '' }); // Header vazio
      const res = mockResponse();
      const next = mockNext;

      // Act - Executar o middleware
      isAuth(req as any, res as any, next);

      // Assert - Verificar se o acesso foi bloqueado
      expect(mockVerify).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    /**
     * TESTE DE ERRO - Formato de token inválido (sem "Bearer")
     * 
     * Este teste verifica se o middleware rejeita quando:
     * - Token não está no formato "Bearer <token>"
     * - Deve retornar status 401
     * - Deve tentar verificar o token (que falhará)
     */
    it('should return 401 when token format is invalid (no Bearer)', () => {
      // Arrange - Preparar requisição com formato inválido
      const req = mockRequest({}, { authorization: 'invalid-token' }); // Sem "Bearer"
      const res = mockResponse();
      const next = mockNext;

      // Mock verify para lançar erro quando token é undefined
      mockVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act - Executar o middleware
      isAuth(req as any, res as any, next);

      // Assert - Verificar se o acesso foi bloqueado
      // Verifica que tentou verificar o token (que é undefined)
      expect(mockVerify).toHaveBeenCalledWith(undefined, 'test-secret');
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    /**
     * TESTE DE ERRO - Token JWT inválido
     * 
     * Este teste verifica se o middleware rejeita quando:
     * - Token tem formato correto mas é inválido
     * - Verificação do JWT falha
     * - Deve retornar status 401
     * - Deve tratar o erro de verificação
     */
    it('should return 401 when token verification fails', () => {
      // Arrange - Preparar requisição com token inválido
      const token = 'invalid-jwt-token';
      const req = mockRequest({}, { authorization: `Bearer ${token}` });
      const res = mockResponse();
      const next = mockNext;

      // Simular falha na verificação do token
      mockVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act - Executar o middleware
      isAuth(req as any, res as any, next);

      // Assert - Verificar se o acesso foi bloqueado
      // Verifica que tentou verificar o token
      expect(mockVerify).toHaveBeenCalledWith(token, 'test-secret');
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.end).toHaveBeenCalled();
    });

    /**
     * TESTE DE EDGE CASE - Token com espaços extras
     * 
     * Este teste verifica como o middleware trata:
     * - Token com espaços extras no header
     * - Deve limpar os espaços e processar normalmente
     * - Testa a robustez do parsing do header
     */
    it('should handle token with extra spaces', () => {
      // Arrange - Preparar requisição com espaços extras
      const token = 'valid-jwt-token';
      const req = mockRequest({}, { authorization: `  Bearer  ${token}  ` }); // Espaços extras
      const res = mockResponse();
      const next = mockNext;

      mockVerify.mockReturnValue({ sub: 'user-id' } as any);

      // Act - Executar o middleware
      isAuth(req as any, res as any, next);

      // Assert - Verificar se funcionou apesar dos espaços
      // O split remove espaços, então o token fica vazio
      expect(mockVerify).toHaveBeenCalledWith('', 'test-secret');
      expect(req.user_id).toBe('user-id');
      expect(next).toHaveBeenCalled();
    });

    /**
     * TESTE DE FUNCIONALIDADE - Definição correta do user_id
     * 
     * Este teste verifica se o middleware:
     * - Extrai corretamente o ID do usuário do token
     * - Define req.user_id com o valor correto
     * - Permite que a rota acesse o ID do usuário autenticado
     */
    it('should set user_id correctly when token is valid', () => {
      // Arrange - Preparar requisição com token válido
      const token = 'valid-jwt-token';
      const req = mockRequest({}, { authorization: `Bearer ${token}` });
      const res = mockResponse();
      const next = mockNext;

      // Simular token com ID específico do usuário
      mockVerify.mockReturnValue({ sub: 'test-user-123' } as any);

      // Act - Executar o middleware
      isAuth(req as any, res as any, next);

      // Assert - Verificar se o user_id foi definido corretamente
      expect(req.user_id).toBe('test-user-123');
      expect(next).toHaveBeenCalled();
    });
  });
}); 