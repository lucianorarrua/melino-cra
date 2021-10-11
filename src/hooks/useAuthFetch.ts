import { SessionStateContex } from './../data/SessionContextProvider';
import React from 'react';
import { SessionContext } from '../data/SessionContextProvider';
import { meliFetch } from '../utils/fetch';

/**
 * Hook con métodos fetch que agregan al header los parametros de autenticación.
 * ¡¡¡Debe utilizarse dentro del SessionContextProvider!!!
 * @returns
 */
export const useAuthFetch = () => {
  const { tryGetToken } = React.useContext<SessionStateContex>(SessionContext);

  const requestWrapper =
    (method: string) =>
    async <T>(input: RequestInfo, init?: RequestInit | undefined) => {
      let token = await tryGetToken();
      if (!token) {
        throw new Error('invalid_token');
      }
      init ??= {};
      init.headers ??= {};
      init = {
        ...init,
        method,
        headers: {
          ...init.headers,
          Authorization: `bearer ${token || ''}`,
        },
      };

      return meliFetch<T>(input, init);
    };

  const requests = {
    get: requestWrapper('get'),
    put: requestWrapper('put'),
    post: requestWrapper('post'),
    delete: requestWrapper('delete'),
  };
  return requests;
};
