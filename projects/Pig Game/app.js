var scores, round_score, active_player, game_playing, previous_val, winning_score;

init();

document.querySelector('.btn-roll').addEventListener('click', function(){
    if (game_playing) {
        var dice = Math.floor(Math.random() * 6) + 1;
        var diceDOM = document.querySelector('.dice');
        var last_diceDOM = document.querySelector('.last-dice');
        diceDOM.style.display = "block";
        last_diceDOM.style.display = "block";
        diceDOM.src = 'dice-' + dice + '.png';
        last_diceDOM.src = 'dice-' + previous_val[active_player] + '.png';
        if (dice !== 1) {
            if (previous_val[active_player] !== 6) {
                round_score += dice;
                document.querySelector('#current-' + active_player).textContent = round_score;
                last_dice_handle()
                previous_val[active_player] = dice;
            } else {
                if (dice === previous_val[active_player]) {
                    scores[active_player] = 0;
                    previous_val = [0, 0];
                    last_dice_handle()
                    notification_fade("Player "+ ifind_player() +' rolled <img src="idice-6.png" class="inline-dice"> + <img src="idice-6.png" class="inline-dice"> <br>in a row');
                    document.querySelector('#score-' + active_player).textContent = scores[active_player];
                    next_player()
                } else {
                    round_score += dice;
                    document.querySelector('#current-' + active_player).textContent = round_score;
                    last_dice_handle()
                    previous_val[active_player] = dice;
                };
            };
        } else {
            previous_val = [0, 0];
            notification_fade("Player "+ ifind_player() +' rolled <img src="idice-1.png" class="inline-dice">');
            last_dice_handle()
            next_player();
        };
    };
});

document.querySelector('.btn-hold').addEventListener('click', function() {
    if (game_playing) {
        notification_fade("Player "+ find_player() + "'s turn.");
        previous_val = [0, 0];
        scores[active_player] += round_score;
        document.querySelector('#score-' + active_player).textContent = scores[active_player];
        if (scores[active_player]  >= winning_score){
            last_dice_handle()
            notification_fade("Player "+ ifind_player() + " Wins.");
            document.querySelector('#name-' + active_player).textContent = 'Winner!';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player-' + active_player + '-panel').classList.add('winner');
            document.querySelector('.player-' + active_player + '-panel').classList.remove('active');
            game_playing = false;
        } else {
            next_player();
        };
    };
});

document.querySelector('.btn-new').addEventListener('click', init);

function next_player() {
    active_player === 0  ? active_player = 1 : active_player = 0;
    round_score = 0;
    document.querySelector('.last-dice').style.display = "none";
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
};
function notification_fade(text) {
    document.getElementById('notification').innerHTML = text;
    document.getElementById('notification').className = "turnover turnover--show";
    setTimeout(function(){ document.getElementById('notification').className = "turnover turnover--fade"; }, 100);
};
function find_player() {
    current_player = parseInt(active_player);
    return(current_player === 0 ? 2 : 1);
};
function ifind_player() {
    current_player = parseInt(active_player);
    return(current_player === 0 ? 1 : 2);
};
function last_dice_handle() {
    if (previous_val[active_player] != 0) {
        document.querySelector('.last-dice').style.display = "block";
    } else {
        document.querySelector('.last-dice').style.display = "none";
    }
}
function init() {
    scores = [0, 0];
    active_player = 0;
    round_score = 0;
    game_playing = true;
    previous_val = [0, 0];
    winning_score = document.getElementById("final-score").value;
    document.querySelector('.last-dice').style.display = 'none';
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').innerHTML = 'Player 1';
    document.getElementById('name-1').innerHTML = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.getElementById('notification').className = "turnover turnover--hidden";
};
