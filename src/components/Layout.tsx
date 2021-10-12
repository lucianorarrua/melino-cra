import React from 'react';
import { useSession } from '../hooks/useSession';
import { Header } from './Header';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sessionState } = useSession();
  return (
    <>
      <Header
        loggedUser={sessionState.meliUser}
        loading={!sessionState.initValues}
      ></Header>
      {children}
    </>
  );
};
