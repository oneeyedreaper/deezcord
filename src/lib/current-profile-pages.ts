import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

import { database } from "@/lib/database";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) return null;

  const profile = await database.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
