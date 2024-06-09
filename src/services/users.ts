import kv from "@vercel/kv";

const DEFAULT_CREDITS = 3;

const getNewUser = async () => {
  return {
    credits: DEFAULT_CREDITS,
    createdAt: Date.now(),
  };
};

export const getInitializedUser = async (userAddress: string) => {
  const userData = (await kv.get(userAddress)) as {
    credits: number;
    createdAt: number;
  };

  if (!userData) {
    const user = await getNewUser();
    await kv.set(userAddress, user);
    return user;
  }

  return userData;
};
