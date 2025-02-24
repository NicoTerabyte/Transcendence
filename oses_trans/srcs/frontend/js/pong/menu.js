export function showMenu(start1v1Callback, startTournamentCallback, startCpuGameCallback) {
	const menu = document.getElementById('menu');
	const start1v1Button = document.getElementById('startGameButton');
	const startTournamentButton = document.getElementById('tournamentButton');
	const startCpuGameButton = document.getElementById('cpuButton');

	console.log("menu got called!!!");
	// Display the main menu
	menu.style.display = 'block';

	// Ensure the "Start Tournament" and "Play Against CPU" buttons are visible
	start1v1Button.style.display = 'block';
	startTournamentButton.style.display = 'block';
	startCpuGameButton.style.display = 'block';

	// Remove previous event listeners to prevent multiple bindings
	start1v1Button.replaceWith(start1v1Button.cloneNode(true));
	startTournamentButton.replaceWith(startTournamentButton.cloneNode(true));
	startCpuGameButton.replaceWith(startCpuGameButton.cloneNode(true));

	// const newStart1v1Button = document.getElementById('startGameButton');
	// const newStartTournamentButton = document.getElementById('tournamentButton');
	// const newStartCpuGameButton = document.getElementById('cpuButton');

	//this is the setup of the buttons, but said buttons are not called :(
	// 1v1 mode
	const startButton = document.getElementById('startGameButton');
	if (startButton) {
	  startButton.addEventListener('click', start1v1Game);
	}

	const tournamentButton = document.getElementById('tournamentButton');
	if (tournamentButton) {
	  tournamentButton.addEventListener('click', startTournament);
	}

	const cpuButton = document.getElementById('cpuButton');
	if (cpuButton) {
	  cpuButton.addEventListener('click', startCpuGame);
	}
  }
