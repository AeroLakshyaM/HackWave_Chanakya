import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68a80079001064c062b6");

export const account = new Account(client);
export const database = new Databases(client, "68a80162002e7f4da4d7");