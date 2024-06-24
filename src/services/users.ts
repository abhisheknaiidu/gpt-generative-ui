import { createClient } from "@vercel/kv";

const DEFAULT_CREDITS = 3;

export const kvClient = createClient({
  url: process.env.KV_REST_API_URL as string, // Ensure type is string
  token: process.env.KV_REST_API_TOKEN as string,
  cache: "no-cache",
});

const generateUserKey = (userAddress: string) => `user:${userAddress}`;
const createDefaultUserData = () => ({
  credits: DEFAULT_CREDITS,
  createdAt: Date.now(),
});

export const getUserWithInitialization = async (userAddress: string) => {
  console.time("GET_USER");
  const userKey = generateUserKey(userAddress);
  const user = await kvClient.get<{ credits: number; createdAt: number }>(
    userKey
  );
  console.log("RETRIEVED USER: ", userKey, user);

  if (!user) {
    const userData = createDefaultUserData();
    console.log("CREATED USER: ", userKey, userData);
    await kvClient.set(userKey, userData);
    return userData;
  }

  console.timeEnd("GET_USER");
  return user;
};

export const updateUserCredits = async (
  userAddress: string,
  usageCredits: number
) => {
  const userData = await getUserWithInitialization(userAddress);
  userData.credits -= usageCredits;

  console.log("UPDATED USER: ", userData);
  await kvClient.set(generateUserKey(userAddress), userData);
};

export const incrementUserCredits = async (
  userAddress: string,
  credits: number
) => {
  const userData = await getUserWithInitialization(userAddress);
  userData.credits += credits;

  console.log("UPDATED USER: ", userData);
  await kvClient.set(generateUserKey(userAddress), userData);
};
