import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Detail from './pages/Detail';
import { Home } from './pages/Home';
import theme from './theme';
import { MeliAuthorization } from './pages/MeliAuthorization';
import { SessionContextProvider } from './data/SessionContextProvider';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SessionContextProvider >
        <BrowserRouter>
          <Switch>
            <Route path='/' exact={true}>
              <Home />
            </Route>
            <Route path='/meli-authorization'>
              <MeliAuthorization />
            </Route>
            <Route path='/detail' exact={true}>
              <Detail />
            </Route>
          </Switch>
        </BrowserRouter>
      </SessionContextProvider>
    </ChakraProvider>
  );
}

export default App;
