 //I import the code from the other
 //files that are needed to make the game work
import { showWinningScreen } from './winningScreen.js';
import { gameLoop } from './gameLoop.js';
import { showMenu } from './menu.js';
import { buttonsHandler } from './buttonsHandler.js'
import { fetchMatches, fetchAllUsers, saveUsers, deleteUser, deleteAllUsers } from './backendFront.js';

let gameMode = '1v1'; // Default mode
let tournamentMatches = []; // Store tournament matches

export function initializeGame(navbar) {
  console.log("initizalizing game");

  //this is the calssic setup done to make the tournament part avaible
  // showMenu(start1v1Game, startTournament, startCpuGame);
  // If these elements exist in your rendered HTML, you can attach event listeners.
    const playerNamesForm = document.getElementById('playerNamesForm');
    if (playerNamesForm) {
      playerNamesForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const names = document.getElementById('playerNames')
          .value.split(',')
          .map(name => name.trim())
          .filter(name => name);
        saveUsers(names, startTournament);
      });
    }

    showMenu(start1v1Game, startTournament, startCpuGame);
    // Attach other event listeners (make sure the referenced elements exist)
    const cancelTournamentSetup = document.getElementById('cancelTournamentSetup');
    if (cancelTournamentSetup) {
      cancelTournamentSetup.addEventListener('click', () => {
        document.getElementById('tournamentSetup').style.display = 'none';
        showMenu(start1v1Game, startTournament, startCpuGame);
      });
    }

    const deleteUserBtn = document.getElementById('deleteUserButton');
    if (deleteUserBtn) {
      deleteUserBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete ALL users from the DB?')) {
          const success = await deleteAllUsers();
          if (success) {
            const setupForm = document.getElementById('playerNamesForm');
            if (setupForm) {
              setupForm.reset();
              document.getElementById('tournamentSetup').style.display = 'none';
            }
            showMenu(start1v1Game, startTournament, startCpuGame);
          }
        }
      });
    }

  // Attach event listeners for game buttons
  // const startButton = document.getElementById('startGameButton');
  // if (startButton) {
  //   startButton.addEventListener('click', start1v1Game);
  // }

  // const tournamentButton = document.getElementById('tournamentButton');
  // if (tournamentButton) {
  //   tournamentButton.addEventListener('click', tournamentSetup());
  // }

  // const cpuButton = document.getElementById('cpuButton');
  // if (cpuButton) {
  //   cpuButton.addEventListener('click', startCpuGame);
  // }


  function start1v1Game() {
    console.log('Starting 1v1 Game');
    if (navbar)
      navbar.style.display = 'none';

    gameMode = '1v1';
    const player1Name = 'Player 1';
    const player2Name = 'Player 2';
    const canvas = document.getElementById('gameCanvas');
    const scores = document.getElementById('scores');
    scores.style.display = 'block';
    canvas.style.display = 'block';
    // buttonsHandler(startButton, cpuButton, tournamentButton, false);
    // Start normal game loop (both paddles controlled by keyboard)
    gameLoop(canvas, endGame, player1Name, player2Name);
  }

  function startCpuGame() {
    console.log('Starting Game Against CPU');
    if (navbar)
      navbar.style.display = 'none';
    gameMode = 'cpu';
    const player1Name = 'Player 1';
    const player2Name = 'CPU';
    const canvas = document.getElementById('gameCanvas');
    const scores = document.getElementById('scores');
    scores.style.display = 'block';
    canvas.style.display = 'block';

    // buttonsHandler(startButton, cpuButton, tournamentButton, false);
    // Pass an extra flag (true) to enable CPU logic in gameLoop
    gameLoop(canvas, endGame, player1Name, player2Name, true);
  }

  // startTournament remains unchanged...
  async function startTournament() {
    console.log('Starting Tournament');
    if (navbar)
      navbar.style.display = 'none';
    gameMode = 'tournament';
    const canvas = document.getElementById('gameCanvas');
    const scores = document.getElementById('scores');
    tournamentMatches = await fetchMatches();
    // buttonsHandler(startButton, cpuButton, tournamentButton, false);
    if (!tournamentMatches.length) {
      alert('No matches available for the tournament.');
      showMenu(start1v1Game, startTournament, startCpuGame);
      return;
    }
    playTournamentMatch(tournamentMatches.shift());
  }

  function playTournamentMatch(match) {
    console.log("starting tournament with this matchup");
    const { player1, player2 } = match;
    const matchAnnouncement = document.getElementById('matchAnnouncement');
    const matchAnnouncementText = document.getElementById('matchAnnouncementText');
    const startMatchButton = document.getElementById('startMatchButton');
    const gameCanvas = document.getElementById('gameCanvas');
    const scores = document.getElementById('scores');
    matchAnnouncementText.textContent = `${player1} vs ${player2}`;
    matchAnnouncement.style.display = 'block';
    gameCanvas.style.display = 'none';
    scores.style.display = 'none';

    startMatchButton.onclick = () => {
    matchAnnouncement.style.display = 'none';
    gameCanvas.style.display = 'block';
    scores.style.display = 'block';
    // Start the game loop with the tournament endGame callback
    gameLoop(gameCanvas, (winner) => endTournamentMatch(winner, player1, player2), player1, player2);
    };
}

async function endTournamentMatch(winner, player1, player2) {
	// Hide the canvas before alerting:
	const gameCanvas = document.getElementById('gameCanvas');
	const scores = document.getElementById('scores');
	gameCanvas.style.display = 'none';
	scores.style.display = 'none';

	const loser = (winner === player1) ? player2 : player1;
	alert(`${winner} is victorious! Eliminating ${loser} from the tournament.`);

	// Delete the loser
	await deleteUser(loser);

// Check if all matches in the current round are played
	if (!tournamentMatches.length) {
		// Fetch remaining matches
		const remainingMatches = await fetchMatches();
    console.log("remaining matches: ", remainingMatches);
    const remainingUsers = await fetchAllUsers();
    console.log("remaining users ", remainingUsers);
		if (remainingMatches.length > 0) {
      // More matches to play, start the next match
      tournamentMatches = remainingMatches;
      playTournamentMatch(tournamentMatches.shift());
      return;
		}

		// No matches remain, check if only one user remains
		// const remainingUsers = await fetchAllUsers();

		if (remainingUsers.length === 1) {
      // Declare the remaining user as the champion
      showWinningScreen(remainingUsers[0].name, restartGame);
		return;
		} else if (remainingUsers.length > 1) {
		// If multiple users remain without matches, start a new round
		tournamentMatches = await fetchMatches();
			if (tournamentMatches.length > 0) {
				playTournamentMatch(tournamentMatches.shift());
				return;
			}
		}

		// If no users remain or an unexpected state occurs
		alert('No players left in the tournament.');
		showMenu(start1v1Game, startTournament, );
		return;
	}

	if (tournamentMatches.length) {
		playTournamentMatch(tournamentMatches.shift());
	}
}
  function endGame(winner) {
    console.log('End Game:', winner);
    if (gameMode === '1v1' || gameMode === 'cpu') {
      const canvas = document.getElementById('gameCanvas');
      //TODO: trovare un modo per prendere e convertire gli score
      const scores = document.getElementById('scores');
      const winningScreen = document.getElementById('winningScreen');
      const winnerMessage = document.getElementById('winnerMessage');
      const restartButton = document.getElementById('restartButton');
      canvas.style.display = 'none';
      scores.style.display = 'none';
      winnerMessage.textContent = `${winner} wins!`;
      winningScreen.style.display = 'block';
      restartButton.onclick = () => {
        winningScreen.style.display = 'none';
        showMenu(start1v1Game, startTournament, startCpuGame);
        // buttonsHandler(startButton, cpuButton, tournamentButton, true);
        navbar.style.display = 'block';

      };
    }
  }

  function restartGame() {
    console.log('Restarting Game');
    const player1ScoreElement = document.getElementById('player1Score');
    const player2ScoreElement = document.getElementById('player2Score');
    player1ScoreElement.textContent = 'Player 1: 0';
    player2ScoreElement.textContent = 'Player 2: 0';
    //!strange but true this works? BUT i need to analyze properly the
    //!the part where i should show case the winner of the tournament or am i dumb?
    //! tomorrow's task tough
    showMenu(start1v1Game, startTournament, startCpuGame);
  }

}


/*
*Task di oggi di revisione e per aggiustare le cose a livello
*organizzativo:
  TODO: vincitore del 1vs1 [X]
  TODO: sistemare il github di django, avendo la modalità
    TODO: torneo non funzionante

  TODO: Revisionare algoritmo della CPU ora come ora non va bene com'è fatto

  * fare schermata di vittoria per locale amatta c'è già
  TODO: salvare scores per 1vs1 di amatta, fare la conversione a modo
  TODO: per il torneo posizione e numero utenti
*/
