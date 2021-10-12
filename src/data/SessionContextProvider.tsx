import React from 'react';
import { Token } from '../models/meli/token';
import { User } from '../models/meli/user';

export type SessionState = {
  token: Token | null;
  meliUser: User | null;
  initValues: boolean;
};

const initialValue: SessionState = {
  token: null,
  meliUser: null,
  initValues: false,
};

type SessionActions =
  | {
      action: 'SET-TOKEN';
      payload: Token | null;
    }
  | {
      action: 'SET-USER';
      payload: User | null;
    }
  | {
      action: 'INIT-VALUES';
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
    case 'INIT-VALUES':
      return { ...state, initValues: true };
    case 'CLEAR':
      return initialValue;
  }
};

export const SessionContext = React.createContext<{
  state: SessionState;
  dispatch: React.Dispatch<SessionActions>;
}>({ state: initialValue, dispatch: () => {} });

export const SessionContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialValue);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
};
