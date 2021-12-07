import fetch from "isomorphic-unfetch";

const API_URI = process.env.API_URI;

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

export const cancelFriendRequest = async (id: string) => {
  const res = await fetch(`${API_URI}/api/fr/${id}/reject`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const { fr } = await res.json();

  return fr;
};

export const acceptFriendRequest = async (id: string, userId: string) => {
  const res = await fetch(`${API_URI}/api/fr/${id}/accept`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data;
};

export const sendFriendRequest = async (username: string) => {
  const res = await fetch(`${API_URI}/api/fr`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  });

  const data = await res.json();

  return data;
};
