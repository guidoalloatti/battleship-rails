class GameController < ApplicationController
    def index
        @own_id = @current_user.id
        @own_player = @current_user.name

        if @own_id == 1
            @rival_player = "Player 2"
            @rival_id = 2
        else
            @rival_player = "Player 1"
            @rival_id = 1
        end

        render "game"
    end

    def player_1
        @own_id = 1
        @own_player = 'Player 1'

        @rival_id = 2
        @rival_player = 'Player 2'

        render "game"
    end

    def player_2
        @own_id = 2
        @own_player = 'Player 2'

        @rival_id = 1
        @rival_player = 'Player 1'

        render "game"
    end

    def show
        @turns = Turn.all
    end

end
