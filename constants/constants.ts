export const authenticationConstants = {
  accessToekn: 'accessToken',
  refreshToken: 'refreshToken',
  teamId: 'teamId',

  errors: {
    missingToken: 'Access token is missing',
    missingTeamId: 'TeamId is missing'
  }
}

export const urls = {
  adminTenant: 'https://api.dev-fugo.com/admin/tenant',
  cmsTenant: 'https://api.dev-fugo.com/cms/tenant',
  cmsPlayer: 'https://api.dev-fugo.com/cms/player'
}
