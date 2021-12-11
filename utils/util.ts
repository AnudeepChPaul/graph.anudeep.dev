import path from 'path'

export function loadEnvVariables() {
  if ( process.env.NODE_ENV !== 'develop' ) {
    return
  }
  require( 'dotenv' ).config( {
    path: path.join( __dirname, "../dev.env" )
  } ).parsed
}

export function log(...rest: any[]) {
  console.log( `[${new Date().toTimeString().substr( 0, 8 )}] ${rest}` )
}