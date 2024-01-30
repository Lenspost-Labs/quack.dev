interface Cast {
  text: string;
  embeds: any[];
  embedsDeprecated: any[];
  mentions: any[];
  mentionsPositions: any[];
}

interface NeynarCast {
  object: string;
  hash: string;
  thread_hash: string;
  parent_hash: null | string;
  parent_url: null | string;
  root_parent_url: null | string;
  parent_author: ParentAuthor;
  author: Author;
  text?: string;
  timestamp?: string;
  embeds?: Embed[];
  frames?: Frame[];
  reactions?: Reactions;
  replies?: Replies;
  mentioned_profiles: any[];
}

interface ParentAuthor {
  fid: null | string;
}

interface Author {
  object: string;
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: Profile;
  follower_count: number;
  following_count: number;
  verifications: any[];
  active_status: string;
}

interface Profile {
  bio: Bio;
}

interface Bio {
  text: string;
  mentioned_profiles: any[]; // Replace `any` with a more specific type if the structure of mentioned_profiles is known.
}

interface Embed {
  url: string;
}

interface Frame {
  version: string;
  title: string;
  image: string;
  buttons: Button[];
  post_url: string;
  frames_url: string;
}

interface Button {
  index: number;
  title: string;
  action_type: string;
}

interface Reactions {
  likes: any[]; // Replace `any` with a more specific type if known.
  recasts: any[]; // Replace `any` with a more specific type if known.
}

interface Replies {
  count: number;
}

export { Cast, NeynarCast };
