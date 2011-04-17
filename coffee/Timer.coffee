# Copyright © 2011 Gilbert "payload" Röhrbein
# License: GNU AGPL 3, see also COPYING file

class Timer
    constructor: (@world, @interval, @callback) ->
        @interval or= 1
        @callback or= null
        @running = true
        @accum = 0
        @world.add_timer(this)

    start: -> @running = true
    pause: -> @running = false
    stop: ->
        @running = false
        @accum = 0
    restart: ->
        @running = true
        @accum = 0
    
    step: (dt) ->
        return undefined if not @running
        @accum += dt
        if @accum >= @interval
            while @accum >= @interval
                @accum = @interval - @accum
            @callback?()

