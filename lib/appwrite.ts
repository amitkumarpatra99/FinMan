"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  if (!endpoint || !project) {
    throw new Error(
      "Appwrite environment variables NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT must be defined. Please check your .env file."
    );
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    return null;
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const secret = process.env.APPWRITE_SECRET;

  if (!endpoint || !project || !secret) {
    throw new Error(
      "Appwrite admin environment variables (NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT, APPWRITE_SECRET) must be defined. Please check your .env file."
    );
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(secret);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
        return new Users(client);
    }
  };
}
