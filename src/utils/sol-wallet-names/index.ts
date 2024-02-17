import { PublicKey } from '@solana/web3.js';
import type { Connection } from '@solana/web3.js';

import axios from 'axios';

import {
  TldParser as ANSTLDParser,
  MainDomain as ANSMainDomain,
} from '@onsol/tldparser';
// Name here is way too generic. We already have our own getProfilePictureUsingSolanaPFPStandard to let's call this the 'Upstream' version
import { getProfilePicture as getProfilePictureUsingSolanaPFPStandardUpstream } from '@solflare-wallet/pfp';

// Just for debugging. Keep them around as they're useful sometimes.
const log = console.log;
const stringify = (object: unknown) => JSON.stringify(object, null, 2);

export interface NonFungibleTokenMetadataStandard {
    name: string;
    description: string;
    image: string;
    external_url: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
    properties: {
      files: Array<{
        uri: string;
        type: string;
      }>;
    };
  }

export interface ProfilePictureResponse {
    isAvailable: boolean;
    url: string;
    name: string;
    metadata: NonFungibleTokenMetadataStandard;
    tokenAccount: PublicKey;
    mintAccount: PublicKey;
  }

interface WalletNameAndProfilePicture {
  walletName: string | null;
  profilePicture: string | null;
}

interface WalletAddressAndProfilePicture {
  walletAddress: string | null;
  profilePicture: string | null;
}

const removeExtension = (string: string, extension: string): string => {
  const extensionWithDot = `.${extension}`;
  if (string.endsWith(extensionWithDot)) {
    return string.split(extensionWithDot)[0];
  }
  return string;
};

// https://www.npmjs.com/package/@onsol/tldparser
export const dotAnythingToWalletAddress = async (
  connection: Connection,
  ansDomainName: string
): Promise<WalletAddressAndProfilePicture> => {
  const parser = new ANSTLDParser(connection);
  const ownerPublicKey = await parser.getOwnerFromDomainTld(ansDomainName);
  return {
    walletAddress: ownerPublicKey?.toBase58() || null,
    profilePicture: null,
  };
};

// https://www.npmjs.com/package/@onsol/tldparser
// Docs for this suck, so check out
// https://github.com/onsol-labs/tld-parser/blob/main/tests/tld-parser.spec.ts#L78
// getMainDomain() is what we want
export const walletAddressToDotAnything = async (
  connection: Connection,
  wallet: PublicKey
): Promise<WalletNameAndProfilePicture> => {
  const parser = new ANSTLDParser(connection);
  // Assume this is an ANS Main Domain - a main domain is the domain that a wallet address
  // with multiple names will resolve to.
  let mainDomain = {} as ANSMainDomain;
  try {
    mainDomain = await parser.getMainDomain(wallet);
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message.includes('Unable to find MainDomain account')) {
      return {
        walletName: null,
        profilePicture: null,
      };
    }
  }
  if (!mainDomain?.domain) {
    return {
      walletName: null,
      profilePicture: null,
    };
  }
  // Yes the . is already included in the tld
  const domainString = `${mainDomain.domain}${mainDomain.tld}`;
  return {
    walletName: domainString,
    profilePicture: null,
  };
};

// https://docs.glow.app/reference/resolve-glow-id
// The 'API' node module has a bunch of issues running in the browser so just use http module directly
export const dotGlowToWalletAddress = async (
  dotGlowDomain: string
): Promise<WalletAddressAndProfilePicture> => {
  const dotGlowUserName = removeExtension(dotGlowDomain, 'glow');
  try {
    const response = await axios.get(
      `https://api.glow.app/glow-id/resolve?handle=${dotGlowUserName}`
    );
    const walletAddress = response.data?.info?.resolved || null;
    const profilePicture = response.data?.info?.image || null;
    return {
      walletAddress,
      profilePicture,
    };
  } catch (error) {
    console.error('Error fetching data from dotGlow:', error);
    return {
      walletAddress: null,
      profilePicture: null,
    };
  }
};

export const walletAddressToDotGlow = async (wallet: PublicKey) => {
  const walletString = wallet.toBase58();
  try {
    const response = await axios.get(
      `https://api.glow.app/glow-id/resolve?wallet=${walletString}`
    );
    const dotGlowUsername = response.data?.info?.handle || null;
    const walletName = `${dotGlowUsername}.glow`;
    const profilePicture = response.data?.info?.image || null;
    return {
      walletName,
      profilePicture,
    };
  } catch (error) {
    console.error('Error fetching data for walletAddressToDotGlow:', error);
    return {
      walletName: null,
      profilePicture: null,
    };
  }
};

// See https://www.quicknode.com/guides/solana-development/accounts-and-data/how-to-query-solana-naming-service-domains-sol/#set-up-your-environment
export const dotSolToWalletAddress = async (
  dotSolDomain: string
): Promise<WalletAddressAndProfilePicture> => {
  try {
    const response = await axios.get(
      `https://sns-sdk-proxy.bonfida.workers.dev/resolve/${dotSolDomain}`
    );

    let walletAddress = null;

    const result = response.data?.result;

    // Bonfida's API is garbage
    if (result !== 'Domain not found') {
      walletAddress = result;
    }

    return {
      walletAddress,
      profilePicture: null,
    };
  } catch (error) {
    console.error('Error fetching data from dotSolToWalletAddress:', error);
    return {
      walletAddress: null,
      profilePicture: null,
    };
  }
};

// See https://www.quicknode.com/guides/solana-development/accounts-and-data/how-to-query-solana-naming-service-domains-sol/#reverse-lookup-find-all-domains-owned-by-a-wallet
export const walletAddressToDotSol = async (
  connection: Connection,
  wallet: PublicKey
): Promise<WalletNameAndProfilePicture> => {
  try {
    const response = await axios.get(
      `https://sns-sdk-proxy.bonfida.workers.dev/domains/${wallet.toBase58()}`
    );

    let walletName = null;

    const firstDomainNoSuffix = response.data?.result?.[0]?.domain;

    if (firstDomainNoSuffix) {
      walletName = `${firstDomainNoSuffix}.sol`;
    }
    return {
      walletName,
      profilePicture: null,
    };
  } catch (error) {
    console.error('Error fetching data from walletAddressToDotSol:', error);
    return {
      walletName: null,
      profilePicture: null,
    };
  }
};

export const dotBackpackToWalletAddress = async (
  dotBackpackDomainName: string,
  jwt: string | null = null
): Promise<WalletAddressAndProfilePicture> => {
  // Note backpack API responses mix snake_case and CamelCase
  const dotBackpackUserName = removeExtension(
    dotBackpackDomainName,
    'backpack'
  );

  // By default use the open public endpoint
  try {
    let response = await axios.get(
      `https://xnft-api-server.xnfts.dev/v1/users/fromUsername?=${dotBackpackUserName}`
    );
    // By default, use the open public endpoint
    // if (!jwt) {
    //   response = await axios.get(
    //     `https://xnft-api-server.xnfts.dev/v1/users/fromUsername?=${dotBackpackUserName}`
    //   );
    // } else {
    //   // Use a JWT if we want profile pictures
    //   // Also note the corrected typo in the URL
    //   response = await axios.get(
    //     `https://backpack-api.xnfts.dev/users?usernamePrefix=${dotBackpackUserName}&blockchain=solana&limit=6`,
    //     {
    //       headers: {
    //         Cookie: `jwt=${jwt}`,
    //       },
    //     }
    //   );
    // }

    const userData = response.data || null;

    if (!userData) {
      return {
        walletAddress: null,
        profilePicture: null,
      };
    }

    const publicKeysDetails = userData?.publicKeys || null;
    const firstPublicKeyDetails = publicKeysDetails?.[0];
    const walletAddress = firstPublicKeyDetails?.publicKey || null;

    if (!jwt) {
      // For the public endpoint, return without profile picture
      return {
        walletAddress,
        profilePicture: null,
      };
    }

    // For JWT endpoint, include profile picture
    const users = userData?.users || null;

    if (!users) {
      return {
        walletAddress: null,
        profilePicture: null,
      };
    }

    const matchingUser = users.find(
      (user: any) => user.username === dotBackpackUserName
    );

    const profilePicture = matchingUser?.image || null;

    if (!matchingUser) {
      return {
        walletAddress: null,
        profilePicture: null,
      };
    }

    const userPublicKeys = matchingUser.public_keys || null;

    if (!userPublicKeys?.length) {
      return {
        walletAddress: null,
        profilePicture: null,
      };
    }

    const solanaPublicKeyDetails = userPublicKeys.find(
      (publicKeyDetails: any) => {
        return publicKeyDetails.blockchain === 'solana';
      }
    );

    if (!solanaPublicKeyDetails) {
      return {
        walletAddress: null,
        profilePicture: null,
      };
    }

    const walletAddressFromUser = solanaPublicKeyDetails.publicKey || null;

    return {
      walletAddress: walletAddressFromUser,
      profilePicture,
    };
  } catch (error) {
    console.error(
      'Error fetching data from dotBackpackToWalletAddress:',
      error
    );
    return {
      walletAddress: null,
      profilePicture: null,
    };
  }
};

// TODO: looks like this endpoint isn't finished, it doesn't work for all backpack users
// and is hidden
export const walletAddressToDotBackpack = async (
  wallet: PublicKey,
  jwt: string | null = null
): Promise<WalletNameAndProfilePicture> => {
  // Sadly there's no public version of this API
  // Matt from Backpack 20230414:
  // "(pubkey -> username) endpoint doesn't exist anymore on purpose for identity obfuscation reasons"
  // It's odd (since name -> pubkey effectively exposes the same info) but 🤷🏻‍♂️
  if (!jwt) {
    return {
      walletName: null,
      profilePicture: null,
    };
  }
  const walletString = wallet.toBase58();
  const backpackAPIEndpoint = `https://backpack-api.xnfts.dev/users?usernamePrefix=${walletString}`;
  try {
    const response = await axios.get(backpackAPIEndpoint, {
      headers: {
        Cookie: `jwt=${jwt}`,
      },
    });
    const users = response.data?.users || null;
    if (!users?.length) {
      return {
        walletName: null,
        profilePicture: null,
      };
    }
    const firstUser = users[0];
    const username = firstUser.username;
    const profilePicture = firstUser.image || null;
    const domainName = `${username}.backpack`;
    return {
      walletName: domainName,
      profilePicture,
    };
  } catch (error) {
    console.error(
      'Error fetching data from walletAddressToDotBackpack:',
      error
    );
    return {
      walletName: null,
      profilePicture: null,
    };
  }
};

export const walletNameToAddressAndProfilePicture = async (
  connection: Connection,
  walletName: string,
  jwt: string | null = null
): Promise<WalletAddressAndProfilePicture> => {
  let walletAddressAndProfilePicture: WalletAddressAndProfilePicture = {
    walletAddress: null,
    profilePicture: null,
  };

  // All domain name services have at least two parts
  const parts = walletName.split('.');
  if (parts.length < 2) {
    return walletAddressAndProfilePicture;
  }

  // Requires people to buy a custom token
  // and is complex to set up, but was more popular
  if (walletName.endsWith('.sol')) {
    walletAddressAndProfilePicture = await dotSolToWalletAddress(walletName);
  }

  if (walletName.endsWith('.glow')) {
    walletAddressAndProfilePicture = await dotGlowToWalletAddress(walletName);
  }

  if (walletName.endsWith('.backpack')) {
    walletAddressAndProfilePicture = await dotBackpackToWalletAddress(
      walletName,
      jwt
    );
  }

  // ANS seems to be the nicest maintained and less land-grab naming service
  // It also has multiple TLDs, so we will fall back to it for all other domains.
  if (!walletAddressAndProfilePicture.walletAddress) {
    walletAddressAndProfilePicture = await dotAnythingToWalletAddress(
      connection,
      walletName
    );
  }

  // Use Solana PFP if we have an address but no profile picture
  if (
    walletAddressAndProfilePicture.walletAddress &&
    !walletAddressAndProfilePicture.profilePicture
  ) {
    const solanaPFPUrl = await getProfilePictureUsingSolanaPFPStandard(
      connection,
      new PublicKey(walletAddressAndProfilePicture.walletAddress)
    );
    walletAddressAndProfilePicture.profilePicture = solanaPFPUrl || null;
  }
  return walletAddressAndProfilePicture;
};

// Try all the major name services, but don't fallback to Solana PFP
export const walletAddressToNameAndProfilePicture = async (
  connection: Connection,
  wallet: PublicKey,
  backpackJWT: string | null = null
): Promise<WalletNameAndProfilePicture> => {
  const solanaPFPStandardImageURL =
    await getProfilePictureUsingSolanaPFPStandard(connection, wallet);
  const dotAnything = await walletAddressToDotAnything(connection, wallet);
  // ANS domains don't have a profile picture, so use Solana PFP Standard
  dotAnything.profilePicture = solanaPFPStandardImageURL || null;
  if (dotAnything?.walletName && dotAnything?.profilePicture) {
    return dotAnything;
  }
  const dotSol = await walletAddressToDotSol(connection, wallet);
  // Likewise .sol doesn't have a profile picture, so use Solana PFP Standard
  dotSol.profilePicture = solanaPFPStandardImageURL || null;
  if (dotSol?.walletName && dotSol?.profilePicture) {
    return dotSol;
  }
  const dotGlow = await walletAddressToDotGlow(wallet);
  if (dotGlow?.walletName && dotGlow?.profilePicture) {
    return dotGlow;
  }
  if (backpackJWT) {
    const dotBackpack = await walletAddressToDotBackpack(wallet, backpackJWT);
    if (dotBackpack?.walletName && dotBackpack?.profilePicture) {
      return dotBackpack;
    }
  }

  return {
    walletName: null,
    profilePicture: null,
  };
};

export const getProfilePictureUsingSolanaPFPStandard = async (
  connection: Connection,
  walletPubkey: PublicKey
) => {
  // https://www.npmjs.com/package/@solflare-wallet/pfp
  const response = (await getProfilePictureUsingSolanaPFPStandardUpstream(
    connection,
    walletPubkey,
    {
      fallback: false,
    }
  )) as ProfilePictureResponse;

  // This API returns the Netscape 'broken' image instead of null when 'fallback' is set to false.
  // (also if we turned 'fallback' on, fallback images are ugly gravatar style autogenerated images)
  // We don't want the ugly Netscape broken images or the ugly garavatar style images so let's return null
  if (!response.url.startsWith('http')) {
    return null;
  }
  return response.url;
};