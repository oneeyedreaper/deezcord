import { auth } from "@clerk/nextjs";

import { database } from "@/lib/database";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const profile = await database.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
