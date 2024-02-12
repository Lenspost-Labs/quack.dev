import prisma from "../clients/prisma";

const updateUserData = async (
  user_id: string,
  username?: string,
  email?: string
) => {
  if (email) {
    await prisma.user_metadata.update({
      where: {
        user_id: user_id,
      },
      data: {
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
