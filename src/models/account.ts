export type Account = {
  username: string;
  permissions: string;
  publicId?: string;
  sessions?: AccountSessions[];
  linkedUserId: string;
};

export type ApiServer = {
  baseName: string;
  identifier: string;
  baseUrl: string;
};

export type AccountSessions = {
  tokenId: string;
  ipAddress: string;
  device: string;
  browser: string;
  originId: string;
  timeCreated: string;
};
