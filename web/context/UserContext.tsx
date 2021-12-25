import React, { createContext, ReactNode, useContext, useState } from "react";
import { Fr, Friends, User } from "../types";

export interface UserContext {
  setFr: (fr: [Fr]) => void;
  setFriends: (friends: [Friends]) => void;
  fr: [Fr] | [];
  friends: [Friends] | [];
}

const UserContext = createContext<UserContext>(null!);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) => {
  const [user, setUser] = useState(initialUser);

  const setFr = (fr: [Fr]) => {
    setUser((user: any) => {
      return {
        ...user,
        fr,
      };
    });
  };

  const setFriends = (friends: [Friends]) => {
    setUser((user: any) => {
      return {
        ...user,
        friends,
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        setFr,
        setFriends,
        fr: user?.fr || [],
        friends: user?.friends || [],
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
