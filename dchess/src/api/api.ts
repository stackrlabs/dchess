export interface Schema {
  primaryType: string;
  types: {
    [key: string]: {
      name: string;
      type: string;
    }[];
  };
}

export interface Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  salt: string;
}

export interface MRUInfo {
  signingInstructions: string;
  domain: Domain;
  transitionToSchema: Record<string, string>;
  schemas: {
    [key: string]: Schema;
  };
}

export interface GameWithId extends Game {
  gameId: string;
}

export type GameStatus = "in_play" | "draw" | "w" | "b";

export interface Game {
  w: string;
  b: string;
  startedAt: number;
  createdAt: number;
  endedAt: number;
  board: string;
  status: GameStatus;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const get = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}/${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return res.json();
};

const getInfo = async () => {
  return get<MRUInfo>("info");
};

const getGame = async (slug: string) => {
  return get<Game>(`games/${slug}`);
};

const getGames = async () => {
  const { games } = await get<{ games: GameWithId[] }>("");
  return games;
};

/* SUBMIT */
const submitAction = async (path: string, data: any) => {
  const res = await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export { getInfo, submitAction, getGame, getGames };
