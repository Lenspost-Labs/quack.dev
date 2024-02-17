import prisma from "../clients/prisma";

const checkIfUsernameAvailable = async (username: string) => {
  let user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user === null) {
    return true;
  } else {
    return false;
  }
};

export default checkIfUsernameAvailable;
