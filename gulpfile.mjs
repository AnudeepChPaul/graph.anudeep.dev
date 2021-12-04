import gulp from 'gulp'
import { rmdirSync } from 'fs'
import { join } from 'path'
import { Chalk } from 'chalk'
import { spawn, exec } from 'child_process'

// chalk = new chalk.Chalk()
const ch = new Chalk({ level: 3 })
const log = console.log.bind(console)

gulp.task('cleanup', function cleanup(cb) {
  log(ch.blue('removing node modules'))
  rmdirSync('node_modules', {recursive: true, force: true})
  log(ch.green('Removed node modules'))
  cb()
})

gulp.task('install', function(cb) {
  log(ch.blue("---------Installing node modules"))
  spawn("yarn", ["install"], {stdio: 'inherit'})
    .on('close', () => {
      log(ch.green("---------node modules updated!"))
      cb()
    })
})

gulp.task('generateCerts', function generateCerts(cb) {
  spawn("yarn", ["run", "generate-certs"], {stdio: 'inherit'})
    .on('close', () => {
      log(ch.green("---------Generated ssl certificates"))
      cb()
    })
})

gulp.task('generateGraphQl', async function (cb) {
  spawn("yarn", ["run", "generate-graphql"], {stdio: 'inherit'})
    .on('close', () => {
      log(ch.green("---------Generated graphql types"))
      cb()
    })
})

gulp.task('setup', gulp.series('install', 'generateCerts', 'generateGraphQl'))