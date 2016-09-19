class Turn < ApplicationRecord
  #after_create_commit { TurnBroadcastJob.perform_later self }
end
