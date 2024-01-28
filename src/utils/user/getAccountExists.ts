import prisma from "../clients/prisma";

const getAccountExists = async (userId: string) => {
  let accStatus = await prisma.user_metadata.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      hasPaid: true,
    },
  });

  return accStatus?.hasPaid || false;
};

export default getAccountExists;