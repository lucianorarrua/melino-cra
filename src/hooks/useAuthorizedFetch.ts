import { useSession } from './useSession';
import { meliFetch } from '../utils/fetch';

/**
 * Hook con métodos fetch que agregan al header los parametros de autenticación.
 * ¡¡¡Debe utilizarse dentro del SessionContextProvider!!!
 * @returns
 */
export const useAuthorizedFetch = () => {
  const { sessionState } = useSession();
  const meliApiBase = 'https://api.mercadolibre.com';

  const requestWrapper =
    (method: string) =>
    async <T>(input: RequestInfo, init?: RequestInit | undefined) => {
      let token = sessionState.token;
      if (!token) {
        throw new Error('invalid_token');
      }
      init = init ? init : {};
      init.headers = init.headers ? init.headers : {};
      init = {
        ...init,
        method,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${token.access_token}`,
        },
      };
      return meliFetch<T>(input, init);
    };

  const MELI_ENDPOINTS = {
    users: {
      me: {
        URL: `${meliApiBase}/users/me`,
        bookmarks: {
          URL: `${meliApiBase}/users/me/bookmarks`,
        },
        addresses: {
          URL: `${meliApiBase}/users/me/addresses`,
        },
      },
    },
    items: {
      URL: `${meliApiBase}/items`,
    },
  };

  const requests = {
    get: requestWrapper('get'),
    put: requestWrapper('put'),
    post: requestWrapper('post'),
    delete: requestWrapper('delete'),
    MELI_ENDPOINTS,
  };
  return requests;
};
