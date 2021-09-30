import fetch from "isomorphic-unfetch";

const API_URI = process.env.API_URI;

export const fetchFr = async () => {
  const res = await fetch(`${API_URI}/api/fr`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const { fr } = await res.json();

  return fr;
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

export const sendFriendRequest = async (userId: string) => {
  const res = await fetch(`${API_URI}/api/fr`, {
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

  const { fr } = await res.json();

  return fr;
};
