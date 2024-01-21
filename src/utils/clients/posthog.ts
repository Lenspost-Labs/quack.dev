import { PostHog } from "posthog-node";

export const posthog = new PostHog(process.env.POSTHOG_API_KEY as string, {
  host: "https://eu.posthog.com",
});

export default posthog;