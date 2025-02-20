 //I import the code from the other
 //files that are needed to make the game work
import { gameLoop } from './gameLoop.js';
import { showMenu } from './menu.js';
// import { showWinningScreen } from './winningScreen.js';
import { fetchMatches, fetchAllUsers, saveUsers, deleteAllUsers } from './backendFront.js';

let gameMode = '1v1'; // Default mode
let tournamentMatches = []; // Store tournament matches

//the DOMContentLoaded event works i a way to make the HTML elements
//!avaiable
//Once the event fires the file will sets up event listeners
//those listeners are defined in the addEventListener
//* AND it works mostly with the handleEvent() function
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM Content Loaded');

	// Existing event listeners for tournament setup and deletion...
	document.getElementById('playerNamesForm').addEventListener('submit', (event) => {
		event.preventDefault();
		const names = document.getElementById('playerNames').value.split(',').map(name => name.trim()).filter(name => name);
		saveUsers(names, startTournament);
	});

	// Show the main menu; note the new CPU callback is passed as third argument
	showMenu(start1v1Game, startTournament, startCpuGame);

	// Listener for “Back” button in tournament setup, etc.
	document.getElementById('cancelTournamentSetup').addEventListener('click', () => {
		document.getElementById('tournamentSetup').style.display = 'none';
		showMenu(start1v1Game, startTournament, startCpuGame);
	});

	const deleteUserBtn = document.getElementById('deleteUserButton');
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
});

function start1v1Game() {
	console.log('Starting 1v1 Game');
	gameMode = '1v1';
	const player1Name = 'Player 1';
	const player2Name = 'Player 2';
	const canvas = document.getElementById('gameCanvas');
	const scores = document.getElementById('scores');
	scores.style.display = 'block';
	canvas.style.display = 'block';
	// Start normal game loop (both paddles controlled by keyboard)
	gameLoop(canvas, endGame, player1Name, player2Name);
}

function startCpuGame() {
	console.log('Starting Game Against CPU');
	gameMode = 'cpu';
	const player1Name = 'Player 1';
	const player2Name = 'CPU';
	const canvas = document.getElementById('gameCanvas');
	const scores = document.getElementById('scores');
	scores.style.display = 'block';
	canvas.style.display = 'block';
	// Pass an extra flag (true) to enable CPU logic in gameLoop
	gameLoop(canvas, endGame, player1Name, player2Name, true);
}

// startTournament remains unchanged...
async function startTournament() {
	console.log('Starting Tournament');
	gameMode = 'tournament';
	const canvas = document.getElementById('gameCanvas');
	const scores = document.getElementById('scores');
	tournamentMatches = await fetchMatches();
	if (!tournamentMatches.length) {
		alert('No matches available for the tournament.');
		showMenu(start1v1Game, startTournament, startCpuGame);
		return;
	}
	playTournamentMatch(tournamentMatches.shift());
}

function endGame(winner) {
	console.log('End Game:', winner);
	if (gameMode === '1v1' || gameMode === 'cpu') {
		const canvas = document.getElementById('gameCanvas');
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
		};
	}
}

function restartGame() {
	console.log('Restarting Game');
	const player1ScoreElement = document.getElementById('player1Score');
	const player2ScoreElement = document.getElementById('player2Score');
	player1ScoreElement.textContent = 'Player 1: 0';
	player2ScoreElement.textContent = 'Player 2: 0';
	showMenu(start1v1Game, startTournament, startCpuGame);
}
