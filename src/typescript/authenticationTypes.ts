export interface AuthenticateInput {
  email: string
  password: string
}

export interface AuthenticateResponse {
  authenticate: {
    auth: {
      accessToken: string
      refreshToken: string
    }
    teamId: string
    tenantId: string
  }
}
