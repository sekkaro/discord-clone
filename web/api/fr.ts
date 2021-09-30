import fetch from "isomorphic-unfetch";

const API_URI = process.env.API_URI;

export const fetchFr = async () => {
  const res = await fetch(`${API_URI}/api/fr`, {
    credentials: "include",
  });

  if (!res.ok) {
    return undefined;
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
    return undefined;
  }

  const { fr } = await res.json();

  return fr;
};
