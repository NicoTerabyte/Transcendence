export function showMenu(startGameCallback) {
	const menu = document.getElementById('menu');
	const startButton = document.getElementById('startGameButton');

	menu.style.display = 'block';

	startButton.addEventListener('click', () => {
	  menu.style.display = 'none';
	  startGameCallback();
	});
  }
