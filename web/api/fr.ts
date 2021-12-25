import fetch from "isomorphic-unfetch";

const API_URI = process.env.API_URI;

export const cancelFriendRequest = async (
  id: string,
  type: string,
  senderId: string
) => {
  const res = await fetch(`${API_URI}/api/fr/${id}/reject`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      senderId,
      type,
    }),
  });

  if (!res.ok) {
    return null;
  }

  const { fr } = await res.json();

  return fr;
};

export const acceptFriendRequest = async (id: string, senderId: string) => {
  const res = await fetch(`${API_URI}/api/fr/${id}/accept`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      senderId,
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
