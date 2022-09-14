(function() {
    var guess10_game,
        nodeGuess10 = {

        nr_of_guesses: 0,
        secret_number: 0,
        io: {},

        run: function() {
            this.setup_io_interface();
            this.set_secret_number();
            this.welcome();
        },

        setup_io_interface: function() {
            var readline = require('readline');

            this.io = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: true
            });
        },

        welcome: function() {
            var self = this;
            console.log('Welcome to Guess10!');
            console.log('S to start a new game!');
            console.log('Q to exit game.');
            console.log('Press ctrl+c to exit the game at any time.');

            this.io.question('S or Q: ', function(answer) {
                self.start_or_quit(answer);
            });
        },

        start_or_quit: function(answer) {
            var self = this,
                game_option = answer.toLowerCase();

            if(game_option === 'q') {
                this.end();
                return;
            }

            if(game_option === 's') {
                this.start();
                return;
            }

            console.log('S to start a new game or Q to quit and exit.');
            this.io.question('S or Q: ', function(new_answer) {
                self.start_or_quit(new_answer);
            });
        },

        start: function() {
            var self = this;
            this.io.question('Guess a number between 1 and 10: ', function(guessed_number) {
                self.evaluate_guess(guessed_number);
            });
        },

        evaluate_guess: function(guess) {
            var self = this,
                query = '',
                guessed_number = parseInt(guess, 0);

            if(guessed_number === this.secret_number) {
                this.increment_guesses();
                console.log('Woohoo, you guessed right!');
                console.log('The secret number was ' + this.secret_number + ' and it took you ' + this.nr_of_guesses + ' guesses!');
                this.restart();
                return;
            }

            if(isNaN(guessed_number) || guessed_number <= 0 || guessed_number >= 10) {
                query = 'Both you and me knows that what you just entered is not a number between 1 and 10.\n\rTry again: ';
            } else if(guessed_number < this.secret_number) {
                query = 'Not quite right. The secret number is higher than ' + guessed_number + '.\n\rTry again: ';
            } else {
                query = 'Not quite right. The secret number is lower than ' + guessed_number + '.\n\rTry again: ';
            }

            this.io.question(query, function(new_guess) {
                self.increment_guesses();
                self.evaluate_guess(new_guess);
            });
        },

        restart: function() {
            var self = this;

            this.secret_number = 0;
            this.nr_of_guesses = 0;

            this.io.question('Play another round? Y or N: ', function(answer) {
                var chosen_answer = answer.toLowerCase();
                if(chosen_answer === 'y') {
                    self.start();
                    return;
                }

                if(chosen_answer === 'n') {
                    console.log('Thanks for playing.');
                    self.end();
                    return;
                }

                self.restart();
            });
        },

        end: function() {
            console.log('Bye bye!');
            this.io.close();
        },

        set_secret_number: function() {
            this.secret_number = Math.floor(Math.random() * (10 - 1)) + 1;
        },

        increment_guesses: function() {
            this.nr_of_guesses = this.nr_of_guesses + 1;
        }
    };

    guess10_game = Object.create(nodeGuess10);
    guess10_game.run();

}());