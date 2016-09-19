class AddingTurns < ActiveRecord::Migration[5.0]
  def change
    create_table :turns do |t|
      t.text :content
      t.text :number
      t.text :player 
      t.text :coordinates

      t.timestamps
    end
  end
end
