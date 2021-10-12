import React from 'react';
import { SessionContext } from '../data/SessionContextProvider';
import { Token } from '../models/meli/token';
import { User } from '../models/meli/user';
import { meliFetch, jsonToUrlEncode } from '../utils/fetch';
import { useStorage } from './useStorage';

export const useSession = () => {
  const { state, dispatch } = React.useContext(SessionContext);
  const storage = useStorage();

  React.useEffect(() => {
    initFlow();
  }, [state.meliUser?.id]);

  const initFlow = async () => {
    console.log('INIT');
    let storageToken = storage.getAndParse<Token>(storage.KEYS.MELI_TOKEN);
    if (storageToken) {
      const refreshedToken = await refreshTokenAndSave(
        storageToken.refresh_token
      );
      if (refreshedToken) {
        await getUserTokenAndSave(refreshedToken);
      }
    }
    dispatch({ action: 'INIT-VALUES' });
  };

  const logout = () => {
    storage.clear();
    dispatch({ action: 'CLEAR' });
    return null;
  };

  /* Si puede, obtiene el token del context. Si no, lo busca del localstorage. Si nada de eso funciona, */
  const getTokenAndSave = async (code: string): Promise<Token | null> => {
    let token;
    try {
      /* Si hay código, intenta obtener un token con dicho código */
      token = await getTokenFromCode(code);
      dispatch({ action: 'SET-TOKEN', payload: token });
      storage.stringifyAndSave(storage.KEYS.MELI_TOKEN, token);
    } catch (error) {
      token = null;
    }
    return token;
  };

  const refreshTokenAndSave = async (
    refresh_token: string
  ): Promise<Token | null> => {
    let token;
    try {
      token = await refreshToken(refresh_token);
      dispatch({ action: 'SET-TOKEN', payload: token });
      storage.stringifyAndSave(storage.KEYS.MELI_TOKEN, token);
    } catch (error) {
      token = null;
    }
    return token;
  };

  const getUserTokenAndSave = async (token?: Token): Promise<User | null> => {
    token = token ? token : state.token!;
    if (!token) {
      return null;
    }
    let user: User | null = null;
    try {
      user = await getUserToken(token);
      dispatch({ action: 'SET-USER', payload: user });
    } catch (error) {
      user = null;
    }
    return user;
  };

  /* REQUESTS */
  const getTokenFromCode = async (code: string) =>
    meliFetch<Token>('https://api.mercadolibre.com/oauth/token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: jsonToUrlEncode({
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_MELI_CLIENT_ID,
        client_secret: process.env.REACT_APP_MELI_CLIENT_SECRET,
        code,
        redirect_uri: process.env.REACT_APP_MELI_REDIRECT_URI,
      }),
    });

  const refreshToken = async (refresh_token: string) =>
    meliFetch<Token>('https://api.mercadolibre.com/oauth/token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: jsonToUrlEncode({
        grant_type: 'refresh_token',
        client_id: process.env.REACT_APP_MELI_CLIENT_ID,
        client_secret: process.env.REACT_APP_MELI_CLIENT_SECRET,
        refresh_token,
      }),
    });

  const getUserToken = async (token: Token) =>
    meliFetch<User>('https://api.mercadolibre.com/users/me', {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

  return {
    getTokenAndSave,
    refreshTokenAndSave,
    getUserTokenAndSave,
    logout,
    sessionState: state,
  };
};
