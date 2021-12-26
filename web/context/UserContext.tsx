import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Fr, Friends, FrType, User } from "../types";
import { socket } from "../utils/socket";

export interface UserContext {
  setFr: (fr: [Fr]) => void;
  setFriends: (friends: [Friends]) => void;
  setUser: (user: User) => void;
  fr: [Fr] | [];
  friends: [Friends] | [];
  pending: number;
}

const UserContext = createContext<UserContext>(null!);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [pending, setPending] = useState(0);

  const fr = user?.fr || [];

  useEffect(() => {
    socket.on("updateFr", async (fr) => {
      setFr(fr);
    });

    socket.on("updateFriends", async (friends) => {
      setFriends(friends);
    });

    return () => {
      socket.off("updateFr");
      socket.off("updateFriends");
    };
  }, []);

  useEffect(() => {
    let count = 0;
    fr.forEach((r) => {
      if (r.type === FrType.IN) {
        count += 1;
      }
    });
    setPending(count);
  }, [fr]);

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
        setUser,
        fr,
        friends: user?.friends || [],
        pending,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
