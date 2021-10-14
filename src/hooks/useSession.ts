import React from 'react';
import { getTokenFromCode, refreshToken } from '../api/auth';
import { getNeighbourFromMeliId } from '../api/back4App';
import { SessionContext } from '../data/SessionContextProvider';
import { Token } from '../models/meli/token';
import { User } from '../models/meli/user';
import { Neighbour } from '../models/melino/neighbour';
import { meliFetch } from '../utils/fetch';
import { useStorage } from './useStorage';

export const useSession = () => {
  const { state, dispatch } = React.useContext(SessionContext);
  const storage = useStorage();

  React.useEffect(() => {
    initFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.meliUser?.id]);

  const logout = () => {
    storage.clear();
    dispatch({ type: 'CLEAR' });
    return null;
  };

  const initFlow = async () => {
    let storageToken = storage.getAndParse<Token>(storage.KEYS.MELI_TOKEN);
    if (storageToken) {
      const refreshedToken = await refreshTokenAndSave(
        storageToken.refresh_token
      );
      if (refreshedToken) {
        const meliUser = await getUserTokenAndSave(refreshedToken);
        await getNeighbourAndSave(meliUser?.id);
      }
    }
    dispatch({ type: 'INIT-VALUES' });
  };
  /* Si puede, obtiene el token del context. Si no, lo busca del localstorage. Si nada de eso funciona, */
  const getTokenAndSave = async (code: string): Promise<Token | null> => {
    let token;
    try {
      /* Si hay código, intenta obtener un token con dicho código */
      token = await getTokenFromCode(code);
      dispatch({ type: 'SET-TOKEN', payload: token });
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
      dispatch({ type: 'SET-TOKEN', payload: token });
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
      user = await meliFetch<User>('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      dispatch({ type: 'SET-USER', payload: user });
    } catch (error) {
      user = null;
    }
    return user;
  };

  const getNeighbourAndSave = async (
    meliUserId: number | undefined
  ): Promise<Neighbour | null> => {
    if (!meliUserId) {
      return null;
    }
    let neighbour: Neighbour | null = null;
    try {
      neighbour = await getNeighbourFromMeliId(meliUserId);
      dispatch({ type: 'SET-NEIGHBOUR', payload: neighbour });
    } catch (error) {
      neighbour = null;
    }
    return neighbour;
  };

  /**
   * Actualiza el Neighbour del store con el Neighbour que pasa como argumento. Si no se pasa el argumento, intenta actualizarlo haciendo un request.
   * @param newNeighbour Neighbour con el cual se va a actualizar el store
   * @returns
   */
  const updateNeighbourAndSave = async (
    newNeighbour?: Neighbour
  ): Promise<Neighbour | null> => {
    if (newNeighbour) {
      dispatch({ type: 'SET-NEIGHBOUR', payload: newNeighbour });
      return newNeighbour;
    }
    if (!state.meliUser) {
      return null;
    }
    return getNeighbourAndSave(state.meliUser.id);
  };

  return {
    getTokenAndSave,
    refreshTokenAndSave,
    getUserTokenAndSave,
    updateNeighbourAndSave,
    logout,
    sessionState: state,
  };
};
