import prisma from "../clients/prisma";

const updateUserData = async (
  user_id: string,
  username?: string,
  email?: string
) => {
  if (email) {
    await prisma.user_metadata.upsert({
      where: {
        user_id: user_id,
      },
      update: {
        email,
      },
      create: {
        user_id,
        email,
      },
    });
    return true;
  }

  let user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user === null) {
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        username,
      },
    });
    return true;
  } else {
    return false;
  }
};

export default updateUserData;
