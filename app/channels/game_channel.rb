class GameChannel < ApplicationCable::Channel
  def subscribed
    puts "Subscribed to game channel"
    stream_from "game_channel"
  end
 
  def unsubscribed
    puts "Unsubscribed to game channel"
  end
 
  def shoot(data)
    puts "Calling to shoot from game channel" 
    Turn.create! player: data['turn']['player'], number: data['turn']['number'], coordinates: data['turn']['coordinates'], content: data['turn']['content'], board: data['turn']['board']
    ActionCable.server.broadcast 'game_channel', turn: data['turn']
  end

  def ships(data)
    puts "Calling to ships from game channel"
    ActionCable.server.broadcast 'game_channel', ships: data['ships']
  end
end
