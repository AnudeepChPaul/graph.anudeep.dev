"use strict"

import gulp from 'gulp'
import { rmdirSync } from 'fs'
import path from 'path'
import { Chalk } from 'chalk'
import { spawn } from 'child_process'
import nodemon from 'gulp-nodemon'

const ch = new Chalk({ level: 3 })
const log = (...rest) => console.log(`[${new Date().toTimeString().substr(0, 8)}] ${rest}`)

function onFileUpdate(changedFiles) {
  const returnTasks = []
  if ( !changedFiles )
    return returnTasks

  changedFiles.forEach(file => {
    switch (path.extname(file)) {
      case '.graphql':
        log(ch.green("================= Graphql file changes..."))
        !returnTasks.includes('generateGraphQl') && returnTasks.push('generateGraphQl')
        break
    }
  })

  return returnTasks;
}

gulp.task('cleanup', function cleanup(done) {
  log(ch.blue('removing node modules'))
  rmdirSync('node_modules', { recursive: true, force: true })
  log(ch.green('Removed node modules'))
  done()
})

gulp.task('install', function (done) {
  log(ch.blue("================= Installing node modules"))
  spawn("yarn", [ "install" ], { stdio: 'inherit' })
    .on('close', () => {
      log(ch.green("================= node modules updated!"))
      done()
    })
})

gulp.task('generateCerts', function generateCerts(done) {
  spawn("/bin/sh", [ "./scripts/generate-certififcate.sh" ], { stdio: 'inherit' })
    .on('close', () => {
      log(ch.green("================= Generated ssl certificates"))
      done()
    })
})

gulp.task('generateGraphQl', async function (done) {
  const cli = spawn("graphql-codegen", [ "--config", "codegen.yml" ], { stdio: 'inherit' })
    .on('close', () => {
      log(ch.green("================= Generated master file with graphql types"))
      cli.kill()
      done()
    })
})

gulp.task('setup', gulp.series('install', 'generateCerts', 'generateGraphQl'))

gulp.task('docker', done => {
  let params = [ "up", "-d" ]
  if (process.argv.includes('--down')) {
    log(ch.green("================= Removing docker components"))
    params = ['down']
  }

  const cli = spawn("docker-compose", params, { stdio: 'inherit' })
    .on('close', () => {
      log(ch.green("================= Docker compose finished"))
      cli.kill()
      done()
    })
})

gulp.task('watch:develop', done => {
  const nodemonIgnoringFiles = [ 'node_modules', 'generated' ]
  const nodemonExecCommand = "ts-node -r tsconfig-paths/register -r ./server.ts"
  const extensionNodemonWillLookFor = 'ts, graphql, env'

  const stream = nodemon({
    exec: nodemonExecCommand,
    debug: true,
    nodeArgs: [ '--inspect=0.0.0.0:9999' ],
    legacyWatch: true,
    watch: [ '.' ],
    ignore: nodemonIgnoringFiles,
    ext: extensionNodemonWillLookFor,
    env: {
      'NODE_ENV': 'develop'
    },
    done: done,
    tasks: onFileUpdate
  });

  stream.on('start', () => {
    log(ch.blue(`[nodemon] ignoring ${nodemonIgnoringFiles.join(", ")}`))
  })

  stream.on('restart', () => {
    log(ch.green('================= Restart signal received ================='))
  })
})
