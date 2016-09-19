App.game = App.cable.subscriptions.create "GameChannel",

  connected: ->
    # Called when the subscription is ready for use on the server
    # console.log("Ready to use server")
    (->@)().allShoots = []
    (->@)().shoots = [[], [], []]
    (->@)().ships = [[], [], []]
 
  disconnected: ->
    # Called when the subscription has been terminated by hootingver
    # console.log("Disconnected from use server")
 
  received: (data) ->
    # Called when there's incoming data on the websocket for this channel
    # console.log "Receiving data from channel!"

    if typeof(data.turn) != 'undefined'
      sender = data['turn']['sender']
      player = data['turn']['player']
      coordinates = data['turn']['coordinates']
      number = data['turn']['number']
      content = data['turn']['content']
      board = data['turn']['board']
      turn_json = { board: board, turn: number, coordinates: coordinates, player: player, content: content } 
      # turn_html = "<div id='turn_" + number + "' class='turn'> Turn: <strong>" + number + "</strong> the player <strong>" + player + "</strong> shooted to <strong>" + coordinates + "</strong> and hit <strong>" + content + "</strong><br/></div>"
      # $('#turns').append turn_html
      (->@)().shoots[player].push turn_json
      (->@)().allShoots.push turn_json
      processRivalShoot(board, player, coordinates, content)
    else
      sender = data['ships']['sender']
      player = data['ships']['player']
      ships = data['ships']['ships']
      board = data['ships']['board']
      (->@)().ships[player].push ships
      processRivalShips(board, player, ships)
 
  shoot: (turn) ->
    # console.log "Shooting!"
    @perform 'shoot', turn: turn

  ships: (ships) ->
    # console.log "Sending Ships!"
    @perform 'ships', ships: ships
