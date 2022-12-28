import { log } from '@/utils/util'
import { createHttpsSever } from '@/httpsServer'
import Gun from 'gun'
import { IGunChainReference } from 'gun/types/chain'

let gunClient: IGunChainReference<any, any, 'pre_root'>

export const connectGunClient = (): IGunChainReference => {
  if ( gunClient ) {
    return gunClient
  }

  log( 'Gun client initiating' )
  const server = createHttpsSever()

  gunClient = Gun( { web: server.listen( 4444 ) } )
  return gunClient
}

export const getClient = (): IGunChainReference => {
  return gunClient
}

export const abc = connectGunClient()

