player_1 = User.create! name: 'Player 1'
player_2 = User.create! name: 'Player 2'

Message.create! title: 'Game 1', content: 'Game 1', user: player_1
Message.create! title: 'Game 2', content: 'Game 2', user: player_2
