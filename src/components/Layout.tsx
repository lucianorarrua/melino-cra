import React from 'react';
import { SessionContext } from '../data/SessionContextProvider';
import { Header } from './Header';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = React.useContext(SessionContext);
  return (
    <>
      <Header loggedUser={state.meliUser}></Header>
      {children}
    </>
  );
};
