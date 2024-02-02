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
}