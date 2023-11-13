export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';

export function setAuthenticated(isAuthenticated) {
  return { type: SET_AUTHENTICATED, isAuthenticated };
}