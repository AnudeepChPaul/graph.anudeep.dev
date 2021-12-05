export function loadEnvVariables() {
  return require('dotenv').config().parsed
}

export function log(...rest: any[]) {
  console.log(`[${new Date().toTimeString().substr(0, 8)}] ${rest}`)
}