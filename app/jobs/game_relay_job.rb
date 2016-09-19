class TurnRelayJob < ApplicationJob
  def perform(turn)
    ActionCable.server.broadcast "turns:#{game.turn_id}:turn",
      turn: GameController.render(partial: 'turn', locals: { turn: turn })
  end
end
