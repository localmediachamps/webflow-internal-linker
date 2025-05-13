import { Session } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}