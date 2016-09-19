// This method is called from the channel when shooting a ship
var processRivalShoot = function(board, player, coordinates, content) {
    var scope = angular.element(document.getElementById('ngBoard')).scope();
    scope.checkShoot(board, player, coordinates, content);
    scope.playerTurn = player;
    scope.allShoots = allShoots;
    if(player == 1) scope.turnNumber++;
    scope.$apply();
}

// This method is called from the channel when the player's ships have being set
var processRivalShips = function(board, player, ships) {
    var scope = angular.element(document.getElementById('ngBoard')).scope();
    scope.assignEnemyShips(player);
    scope.$apply();
}

var app = angular.module("battleship", []); 
app.controller("GameCtrl", function($scope) {
    
    $scope.possibleLetters = "ABCDEFGHIJ";
    $scope.lettersIndex = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9, J: 10 };
    $scope.indexLetters = { "1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "6": "F", "7": "G", "8": "H", "9": "I", "10": "J" };
    $scope.possiblePositions = [ 'Up', 'Down', 'Left', 'Right' ];
    $scope.turnNumber = 1;
    $scope.shipsShooted = 0;
    $scope.shoots = [[],[],[]];
    $scope.ships = [[],[],[]];
    $scope.usedCells = [[],[],[]];
    $scope.scoreToWin = 17;
    $scope.randomisable = true;
    $scope.startable = true;
    $scope.gameLabel = "Start Game!"
    $scope.turnStatus = "Please set your ships."
    $scope.myTurn = false;
    $scope.player = '';
    $scope.enemyShipsSet = false;
    $scope.board = '';
    $scope.playerTurn = 1;
    $scope.allShoots = [];

    $scope.generateRandomCoordinates = function() {
        var valid_coordinates = true;
        var letter = $scope.getRandomLetter();
        var number = $scope.getRandomNumber();
        var coordinates = letter+'-'+number;
        var ships = (($scope.players == 1) ? $scope.player2 : 3);
        
        angular.forEach($scope.myShips, function(ship){
            if(ship.coordinates == coordinates) valid_coordinates = false;
        });

        if(valid_coordinates) return coordinates;
        else return $scope.generateRandomCoordinates();
    };

    $scope.getRandomLetter = function() {
        return $scope.possibleLetters.charAt(Math.floor(Math.random() * $scope.possibleLetters.length));
    }

    $scope.getRandomNumber = function() {
        return Math.floor(Math.random()*(10-1+1)+1);
    }

    $scope.checkAvailableCoordinates = function(player, coordinates) {
        var valid_coordinates = true;
        angular.forEach($scope.usedCells[player], function(cell){
            
            var splitted_coordinates = cell.split("-");
            var letter = splitted_coordinates[0];   
            var number = splitted_coordinates[1];

            var next_letter = $scope.indexLetters[$scope.lettersIndex[letter]+1];
            var previous_letter = $scope.indexLetters[$scope.lettersIndex[letter]-1];
            var next_number = parseInt(parseInt(number)+1);
            var previous_number = parseInt(parseInt(number)-1);

            if (coordinates == letter+"-"+number ||                  // Letter, number => center
                coordinates == letter+"-"+next_number ||             // Number plus one => left
                coordinates == letter+"-"+previous_number ||         // Number minus one => right
                coordinates == next_letter+"-"+number ||             // Letter plus one => down
                coordinates == previous_letter+"-"+number ||         // Letter minus one => up
                coordinates == next_letter+"-"+next_number ||        // Letter plus one, number plus one => Up and right
                coordinates == next_letter+"-"+previous_number ||    // Letter plus one, number minus one => Up and left
                coordinates == previous_letter+"-"+next_number ||    // Letter minus one, number plus one => Down and right
                coordinates == previous_letter+"-"+previous_number)  // Letter minus one, number minus one => Down and left
                valid_coordinates = false;
        });
        return valid_coordinates;
    }

    $scope.getShipDirection = function(size, coordinates) {

        var direction = $scope.possiblePositions[Math.floor(Math.random()*$scope.possiblePositions.length)];
        var splitted_coordinates = coordinates.split("-");
        var letter = splitted_coordinates[0];
        var number = splitted_coordinates[1];

        var left_endpoint = parseInt(parseInt(number) - (parseInt(size - 1)));
        var right_endpoint = parseInt(parseInt(number) + (parseInt(size - 1)));
        var up_endpoint = parseInt($scope.lettersIndex[letter] - (size - 1));
        var down_endpoint = parseInt($scope.lettersIndex[letter] + (size - 1));

        if(direction == 'Left' && left_endpoint < 1) direction = 'Right';
        else if (direction == 'Right' && right_endpoint > 10) direction = 'Left';
        else if (direction == 'Up' && up_endpoint < 1) direction = 'Down';
        else if (direction == 'Down' && down_endpoint > 10) direction = 'Up';

        return direction;
    }

    $scope.checkShipWillFit = function(player, size, original_coordinates, ship_direction) {
        if(!$scope.checkAvailableCoordinates(player, original_coordinates)) return false;
        
        var coordinates = [];
        coordinates.push(original_coordinates);
        var shipCanFit = true;
        
        for(var i = 0; i < (size - 1); i++) {

            var splitted_coordinates = coordinates[coordinates.length-1].split("-");
            var letter = splitted_coordinates[0];
            var number = parseInt(splitted_coordinates[1]);
            
            switch(ship_direction) {
                case 'Up':
                    var new_coordinates = String.fromCharCode(letter.charCodeAt() - 1) + "-" + number; break;
                case 'Down':
                    var new_coordinates = String.fromCharCode(letter.charCodeAt() + 1) + "-" + number; break;
                case 'Left':
                    var new_coordinates = letter + "-" + parseInt(number-1); break;
                case 'Right':
                    var new_coordinates = letter + "-" + parseInt(number+1); break;
            }
            if(!$scope.checkAvailableCoordinates(player, new_coordinates)) return false;
            coordinates.push(new_coordinates);
        }
        return true;
    }

    $scope.getShipCoordinates = function(size, player) {
        var coordinates = [];
        var original_coordinates = $scope.generateRandomCoordinates();
        var ship_direction = $scope.getShipDirection(size, original_coordinates);
        
        while(!$scope.checkShipWillFit(player, size, original_coordinates, ship_direction)) {
            original_coordinates = $scope.generateRandomCoordinates();
            ship_direction = $scope.getShipDirection(size, original_coordinates);
        }
        coordinates.push(original_coordinates);
        $scope.usedCells[player].push(original_coordinates);

        for (var i = 1; i < size; i++) {

            var splitted_coordinates = coordinates[coordinates.length-1].split("-");
            var letter = splitted_coordinates[0];
            var number = parseInt(splitted_coordinates[1]);

            switch(ship_direction) {
                case 'Up':
                    var new_coordinates = String.fromCharCode(letter.charCodeAt() - 1) + "-" + number; break;
                case 'Down':
                    var new_coordinates = String.fromCharCode(letter.charCodeAt() + 1) + "-" + number; break;
                case 'Left':
                    var new_coordinates = letter + "-" + parseInt(number-1); break;
                case 'Right':
                    var new_coordinates = letter + "-" + parseInt(number+1); break;
            }
            coordinates.push(new_coordinates);
            $scope.usedCells[player].push(coordinates[coordinates.length-1]);
        }
        return coordinates;
    };

    $scope.clearAllShips = function() {
        angular.forEach($scope.usedCells[$scope.player], function(cell) {
            $("#board_" +$scope.player+ "_player_" + $scope.player + "-" + cell).removeClass('my-ship-cell');
        });
        $scope.usedCells[$scope.player] = [];
    }

    // This method sets the original sips location
    $scope.setMyShipsLocation = function() {
        $scope.clearAllShips();
        $scope.ships[$scope.player] = $scope.generateShipsArray($scope.player);        
    }

    $scope.generateShipsArray = function(player) {
        return [
            { name: "Carrier", size: "5", coordinates:    $scope.getShipCoordinates(5, player) },
            { name: "Battleship", size: "4", coordinates: $scope.getShipCoordinates(4, player) },
            { name: "Submarine", size: "3", coordinates:  $scope.getShipCoordinates(3, player) },
            { name: "Cruiser", size: "3", coordinates:    $scope.getShipCoordinates(3, player) },
            { name: "Destroyer", size: "2", coordinates:  $scope.getShipCoordinates(2, player) }
        ];
    }

    // This method provides the functionality to randomise own ships
    $scope.randomizeShips = function(player) {
        $scope.board = player;
        $scope.setMyShipsLocation();
        $scope.drawMyShips();
    };


    $scope.setShip = function(coordinates) {
        $("#board_" +$scope.player+ "_player_" + $scope.player + "-" + coordinates).addClass('my-ship-cell');
    };

    $scope.setTouched = function(coordinates, player) {
        $("#board_" +$scope.player+ "_player_" + player + "-" + coordinates).addClass('enemy-ship-cell');
    }

    $scope.setWater = function(coordinate, player) {
        $("#board_" +$scope.player+ "_player_" + player + "-" + coordinate).addClass('water-cell');
    }

    $scope.drawMyShips = function() {
        angular.forEach($scope.ships[$scope.player], function(ship) { 
            angular.forEach(ship.coordinates, function(coordinate) {
                $scope.setShip(coordinate);
            });
        });
    }

    $scope.checkShoot = function(player, board, coordinates, content) {
        if(content == 'water') {
            $("#board_"+board+"_player_"+player+"-"+coordinates).addClass('water-cell');
        } else if(content == 'ship') {
            $("#board_"+board+"_player_"+player+"-"+coordinates).addClass('touched-cell');
            $("#board_"+board+"_player_"+player+"-"+coordinates).html('X');
        }
    }

    $scope.shootTo = function(shooting_coordinate) {
        var valid_turn = true;
        var content = 'water';
        var is_water = true;

        angular.forEach($scope.shoots[$scope.player], function(shoot) {
            if(shoot == shooting_coordinate) {
                $scope.message = "Coordinate already shooted: " + shooting_coordinate + "!";
                valid_turn = false;
            }
        });

        if($scope.startable) {
            $scope.message = "Game has not yet started!";
            valid_turn = false;
        }

        
        if($scope.shipsShooted >= $scope.scoreToWin) {
            $scope.message = "Game is over!";
            valid_turn = false;
        }

        if($scope.playerTurn != $scope.player) {
            $scope.message = "This is not your turn!";
            valid_turn = false;
        }

        if($scope.ships[1].length < 1 || $scope.ships[2].length < 1) {
            $scope.message = "Please wait for the other player to start the game!";
            valid_turn = false;
        }

        if(!valid_turn) return false;

        $scope.message = "";

        var player = ($scope.player == 1 ? 2 : 1);
        angular.forEach($scope.ships[player], function(ship) {
            angular.forEach(ship.coordinates, function(cell) {
                if(shooting_coordinate == cell) {
                    $scope.setTouched(shooting_coordinate, player);
                    $scope.shipsShooted++;
                    is_water = false;
                    content = 'ship';
                }
            });
        });
        
        if(is_water) $scope.setWater(shooting_coordinate, player);
        $scope.shoots[$scope.player].push(shooting_coordinate);
        
        var board = ($scope.board == 1 ? 2 : 1);
        var player = ($scope.player == 1 ? 2 : 1);

        $scope.board_response = 
            App.game.shoot({
                sender: 'turn',
                number: $scope.turnNumber, 
                player: player, 
                coordinates: shooting_coordinate, 
                content: content,
                board: board
            });

        if($scope.shipsShooted >= $scope.scoreToWin) {
            $scope.message = "Game over! You WIN!!!";
            setTimeout(function(){
                alert("Game over! You WIN!");
            }, 700);
        };
    };

    $scope.assignEnemyShips = function(player) {
        $scope.ships[player] = ships[player][0];
    }

    $scope.startGame = function(player) {
        $scope.gameLabel = "Game Already Started!";
        $scope.turnStatus = "Is it your turn?";
        $scope.randomisable = false;
        $scope.startable = false;
        $scope.myTurn = true;

        $scope.sendShips = 
            App.game.ships({
                sender: 'ship',
                player: $scope.player, 
                ships: $scope.ships[player],
                board: $scope.board
            });
    }

    setTimeout(function(){
        $scope.randomizeShips($scope.player); 
    }, 100);
});
