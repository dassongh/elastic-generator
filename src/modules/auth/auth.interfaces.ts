export interface TokenData {
  access: string;
  refresh: string;
}

export interface TokenPayload {
  sub: number;
  iat?: number;
  exp?: number;
}
