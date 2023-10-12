import { User } from "firebase/auth";
import { createContext } from "react";

// This is the UserContext that we can use across all components
export const UserContext = createContext<User | undefined>(undefined);
