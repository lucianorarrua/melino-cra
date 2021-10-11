import { ErrorResponse } from '../models/meli/errorResponse';

const meliFetch = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => {
  const response = await fetch(input, init);
  const jsonResponse = await response.json();
  if (!response.ok) {
    throw Promise.reject<ErrorResponse>(jsonResponse);
  }
  return Promise.resolve<T>(jsonResponse);
};

const jsonToUrlEncode = (jsonObject: any): string =>
  Object.entries<any>(jsonObject)
    .map((x) => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
    .join('&');

export { meliFetch, jsonToUrlEncode };
