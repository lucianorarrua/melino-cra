import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Detail from './pages/Detail';
import { Home } from './pages/Home';
import theme from './theme';
import { MeliAuthorization } from './pages/MeliAuthorization';
import { SessionContextProvider } from './data/SessionContextProvider';
import { Layout } from './components/Layout';
import Parse from 'parse';

function App() {
  Parse.serverURL = process.env.REACT_APP_PARSE_HOST_URL || '';
  Parse.initialize(
    process.env.REACT_APP_PARSE_APPLICATION_ID || '',
    process.env.REACT_APP_PARSE_JAVASCRIPT_KEY || ''
  );

  return (
    <ChakraProvider theme={theme}>
      <SessionContextProvider>
        <Layout>
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
        </Layout>
      </SessionContextProvider>
    </ChakraProvider>
  );
}

export default App;
