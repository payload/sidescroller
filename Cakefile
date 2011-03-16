fs = require 'fs'
path = require 'path'
{spawn, exec} = require 'child_process'

# Run a CoffeeScript through coffee interpreter.
run = (args) ->
    console.log('coffee', args.join(' '))
    proc = spawn 'coffee', args
    proc.stderr.on 'data', (buffer) -> console.log buffer.toString()
    proc.on 'exit', (status) -> process.exit(1) if status != 0

task 'build', 'build sidescroller', ->
    dir = './'
    files = fs.readdirSync dir
    files = (dir + file for file in files when file.match(/\.coffee$/))
    run ['-c'].concat(files)
