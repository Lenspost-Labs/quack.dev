import posthog from "../clients/posthog";

export const userLogin = async (user_id: string) => {
  posthog.capture({
    distinctId: user_id,
    event: "user_login",
  });
};

export const userPayed = async (user_id: string) => {
  posthog.capture({
    distinctId: user_id,
    event: "user_payed",
  });
};
