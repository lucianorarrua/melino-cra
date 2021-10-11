import React from 'react';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useStorage } from '../hooks/useStorage';
import { Token } from '../models/meli/token';
import { User } from '../models/meli/user';
import { jsonToUrlEncode, meliFetch } from '../utils/fetch';

export type SessionState = {
  token: Token | null;
  meliUser: User | null;
};

export type SessionStateContex = {
  state: SessionState;
  tryGetToken: () => Promise<Token | null>;
  tryRefreshToken: () => Promise<Token | null>;
};

const initialContextValues: SessionStateContex = {
  state: { token: null, meliUser: null },
  tryGetToken: () => Promise.resolve(null),
  tryRefreshToken: () => Promise.resolve(null),
};

type SessionActions =
  | {
      action: 'SET-TOKEN';
      payload: Token;
    }
  | {
      action: 'SET-USER';
      payload: User;
    }
  | {
      action: 'CLEAR';
    };

const reducer = (state: SessionState, action: SessionActions): SessionState => {
  switch (action.action) {
    case 'SET-TOKEN':
      return { ...state, token: action.payload };
    case 'SET-USER':
      return { ...state, meliUser: action.payload };
    case 'CLEAR':
      return initialContextValues.state;
  }
};

export const SessionContext =
  React.createContext<SessionStateContex>(initialContextValues);

export const SessionContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    reducer,
    initialContextValues.state
  );
  const storage = useStorage();

  React.useEffect(() => {
    console.log('INIT');

    init();
  }, []);

  const getToken = async (code: string) =>
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

  const logout = () => {
    storage.clear();
    dispatch({ action: 'CLEAR' });
    return null;
  };

  const init = async () => {
    if (!(await tryGetToken())) {
      return;
    }
    const token = await tryRefreshToken();
    if (!token) {
      return null;
    }
    const payload = await meliFetch<User>(
      'https://api.mercadolibre.com/users/me',
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
    if (payload) {
      dispatch({ action: 'SET-USER', payload });
    }
  };

  const tryGetToken = async (): Promise<Token | null> => {
    let token =
      state.token || storage.getAndParse<Token>(storage.KEYS.MELI_TOKEN);
    if (!token) {
      /* Si no hay token, comprueba si hay código */
      const code = storage.get(storage.KEYS.MELI_CODE);
      if (!code) {
        /* Si no hay código ni token limpia todo */
        return logout();
      }
      try {
        /* Si hay código, intenta obtener un token con dicho código */
        token = await getToken(code!);
        storage.stringifyAndSave(storage.KEYS.MELI_TOKEN, token);
      } catch (error) {
        return logout();
      }
    }
    return token;
  };

  const tryRefreshToken = async (): Promise<Token | null> => {
    let token = await tryGetToken();
    if (!token) {
      return logout();
    }
    try {
      token = await refreshToken(token.refresh_token);
      storage.stringifyAndSave(storage.KEYS.MELI_TOKEN, token);
    } catch (error) {
      return logout();
    }
    return token;
  };

  return (
    <SessionContext.Provider value={{ state, tryGetToken, tryRefreshToken }}>
      {children}
    </SessionContext.Provider>
  );
};
