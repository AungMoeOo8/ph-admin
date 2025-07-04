import { User } from "./hooks/auth";

export function getUserFromStorage() {
  const json = sessionStorage.getItem("user");
  if (!json) return null;

  const user: User = JSON.parse(json);
  return user;
}

export function setUserToStorage(user: User) {
  return sessionStorage.setItem("user", JSON.stringify(user));
}
