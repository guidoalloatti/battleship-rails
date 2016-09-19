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

        @messages = Message.all
        @turns = Turn.all
        render "game"
    end

    def show
        @turns = Turn.all
    end

end
