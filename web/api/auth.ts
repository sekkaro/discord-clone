const API_URI = process.env.API_URI;

export const login = (email: string, password: string) =>
  new Promise(async (resolve, reject) => {
    const res = await fetch(`${API_URI}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      reject(new Error("Login or password is invalid."));
    }

    const json = await res.json();

    resolve(json);
  });

export const register = (email: string, password: string, username: string) =>
  new Promise(async (resolve, reject) => {
    const res = await fetch(`${API_URI}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
      }),
      credentials: "include",
    });

    const json = await res.json();

    if (!res.ok || json.status === "failed") {
      reject(json);
    }

    resolve(json);
  });

export const fetchUser = async () => {
  const res = await fetch(`${API_URI}/api/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data;
};
