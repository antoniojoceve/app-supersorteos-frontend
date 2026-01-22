const TOKEN_KEY = "token";
const USER_KEY = "user";

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Evita bucles raros si ya estamos en login
  if (!window.location.pathname.includes("login")) {
    window.location.href = "login.html";
  }
}
