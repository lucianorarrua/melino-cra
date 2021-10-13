import React from 'react';
import { Token } from '../models/meli/token';
import { User } from '../models/meli/user';
import { Neighbour } from '../models/melino/neighbour';

export type SessionState = {
  token: Token | null;
  meliUser: User | null;
  neighbour: Neighbour | null;
  initValues: boolean;
};

const initialValue: SessionState = {
  token: null,
  meliUser: null,
  neighbour: null,
  initValues: false,
};

type SessionActions =
  | {
      type: 'SET-TOKEN';
      payload: Token | null;
    }
  | {
      type: 'SET-USER';
      payload: User | null;
    }
  | {
      type: 'SET-NEIGHBOUR';
      payload: Neighbour | null;
    }
  | {
      type: 'INIT-VALUES';
    }
  | {
      type: 'CLEAR';
    };

const reducer = (state: SessionState, action: SessionActions): SessionState => {
  switch (action.type) {
    case 'SET-TOKEN':
      return { ...state, token: action.payload };
    case 'SET-USER':
      return { ...state, meliUser: action.payload };
    case 'SET-NEIGHBOUR':
      return { ...state, neighbour: action.payload };
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
