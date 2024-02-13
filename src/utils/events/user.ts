import posthog from "../clients/posthog";

export const userLogin = (user_id: string) => {
  posthog.capture({
    distinctId: user_id,
    event: "user_login",
  });
};

export const userPayed = (user_id: string) => {
  posthog.capture({
    distinctId: user_id,
    event: "user_payed",
  });
};

export const userLoginFirstTime = (user_id: string) => {
  posthog.capture({
    distinctId: user_id,
    event: "user_login_first_time",
  });
};

export const userCasted = (user_id: string) => {
  posthog.capture({
    distinctId: user_id,
    event: "user_casted",
  });
};

export const userReacted = (
  user_id: string,
  hash: string,
  reaction: number
) => {
  posthog.capture({
    distinctId: user_id,
    properties: {
      hash: hash,
      reaction: reaction,
    },
    event: "user_reacted",
  });
};
