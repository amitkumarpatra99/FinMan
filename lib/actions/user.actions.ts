'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

export const signIn = async ({ email, password }: any) => {
    try {
      const { account } = await createAdminClient();
      const response = await account.createEmailPasswordSession(email, password);
      
      (await cookies()).set("appwrite-session", response.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      return parseStringify(response);
    } catch (error) {
      console.error('Error', error);
    }
}

export const signUp = async (userData: any) => {
    const { email, password, firstName, lastName } = userData;
    
    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
        );

        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(newUserAccount);
    } catch (error) {
        console.error('Error', error);
    }
}

export const getLoggedInUser = async () => {
    try {
      const client = await createSessionClient();
      if(!client) return null;
      
      const { account } = client;
      const user = await account.get();
      return parseStringify(user);
    } catch (error) {
      console.log(error)
      return null;
    }
}

export const logoutAccount = async () => {
    try {
        const client = await createSessionClient();
        if(!client) return null;

        const { account } = client;
        (await cookies()).delete('appwrite-session');
        await account.deleteSession('current');
    } catch (error) {
        return null;
    }
}
