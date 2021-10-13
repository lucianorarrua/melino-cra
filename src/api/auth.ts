import { Token } from '../models/meli/token';
import { User } from '../models/meli/user';
import { jsonToUrlEncode, meliFetch } from '../utils/fetch';

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

export { getTokenFromCode, refreshToken };
