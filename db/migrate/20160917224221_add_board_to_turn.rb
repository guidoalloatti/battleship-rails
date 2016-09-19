class AddBoardToTurn < ActiveRecord::Migration[5.0]
  def change
    add_column :turns, :board, :string
  end
end
