import { Navbar } from "../components/navbar.js";
import { initializeGame } from "../pong/app.js"

export function renderPongPage() {
  const root = document.getElementById("root");
  root.innerHTML = ""; // Clear previous content

  // Add the navbar
  const navbar = Navbar();
  root.appendChild(navbar);

  // Pong container
  const pongContainer = document.createElement("div");
  pongContainer.id = "pong-container";

  // Title
  const title = document.createElement("h1");
  title.id = "title";
  title.textContent = "Pong";
  pongContainer.appendChild(title);

  // Menu
  const menu = document.createElement("div");
  menu.id = "menu";

  const startButton = document.createElement("button");
  startButton.id = "startButton";
  startButton.textContent = "Start Game";
  menu.appendChild(startButton);
  pongContainer.appendChild(menu);

  // Scores
  const scores = document.createElement("div");
  scores.id = "scores";
  scores.style.display = "none";

  const player1Score = document.createElement("span");
  player1Score.id = "player1Score";
  player1Score.textContent = "Player 1: 0";
  scores.appendChild(player1Score);

  const player2Score = document.createElement("span");
  player2Score.id = "player2Score";
  player2Score.textContent = "Player 2: 0";
  scores.appendChild(player2Score);

  pongContainer.appendChild(scores);

  // Game Canvas
  const gameCanvas = document.createElement("canvas");
  gameCanvas.id = "gameCanvas";
  gameCanvas.width = 1000;
  gameCanvas.height = 500;
  gameCanvas.style.display = "none";
  pongContainer.appendChild(gameCanvas);

  // Winning Screen
  const winningScreen = document.createElement("div");
  winningScreen.id = "winningScreen";
  winningScreen.style.display = "none";

  const winnerMessage = document.createElement("h2");
  winnerMessage.id = "winnerMessage";
  winningScreen.appendChild(winnerMessage);

  const restartButton = document.createElement("button");
  restartButton.id = "restartButton";
  restartButton.textContent = "Restart Game";
  winningScreen.appendChild(restartButton);

  pongContainer.appendChild(winningScreen);

  // Append the pong container to the root
  root.appendChild(pongContainer);

  // Initialize the game logic
  initializeGame();
}

// import { Navbar } from "../components/navbar.js";
// import { startGame } from "../app.js";
// import { restartGame } from "../app.js";
// import { showMenu } from "../menu.js";

// let appJsLoaded = false;

// export function renderPongPage() {
//   const root = document.getElementById("root");
//   root.innerHTML = ""; // Clear previous content

//   // Add the navbar
//   const navbar = Navbar();
//   root.appendChild(navbar);

//   // Pong container
//   const pongContainer = document.createElement("div");
//   pongContainer.id = "pong-container";

//   // Title
//   const title = document.createElement("h1");
//   title.id = "title";
//   title.textContent = "Pong";
//   pongContainer.appendChild(title);

//   // Menu
//   const menu = document.createElement("div");
//   menu.id = "menu";

//   const startButton = document.createElement("button");
//   startButton.id = "startButton";
//   startButton.textContent = "Start Game";
//   menu.appendChild(startButton);
//   pongContainer.appendChild(menu);

//   // Scores
//   const scores = document.createElement("div");
//   scores.id = "scores";
//   scores.style.display = "none";

//   const player1Score = document.createElement("span");
//   player1Score.id = "player1Score";
//   player1Score.textContent = "Player 1: 0";
//   scores.appendChild(player1Score);

//   const player2Score = document.createElement("span");
//   player2Score.id = "player2Score";
//   player2Score.textContent = "Player 2: 0";
//   scores.appendChild(player2Score);

//   pongContainer.appendChild(scores);

//   // Game Canvas
//   const gameCanvas = document.createElement("canvas");
//   gameCanvas.id = "gameCanvas";
//   gameCanvas.width = 1000;
//   gameCanvas.height = 500;
//   gameCanvas.style.display = "none";
//   pongContainer.appendChild(gameCanvas);

//   // Winning Screen
//   const winningScreen = document.createElement("div");
//   winningScreen.id = "winningScreen";
//   winningScreen.style.display = "none";

//   const winnerMessage = document.createElement("h2");
//   winnerMessage.id = "winnerMessage";
//   winningScreen.appendChild(winnerMessage);

//   const restartButton = document.createElement("button");
//   restartButton.id = "restartButton";
//   restartButton.textContent = "Restart Game";
//   winningScreen.appendChild(restartButton);

//   pongContainer.appendChild(winningScreen);

//   // Append the pong container to the root
//   root.appendChild(pongContainer);

//     // Attach event listeners directly here

//   startButton?.addEventListener('click', startGame);
//   restartButton?.addEventListener('click', restartGame);

//   showMenu(startGame);
  // Dynamically import and initialize the Pong game logic
  // this has to be added only once to avoid errors
  // partial solution: I have placed directly into the index.html (LOL)

  // if (!appJsLoaded)
  // {
  //   const script_path = 'js/app.js';
  //   const script = document.createElement('script');
  //   script.setAttribute('id', 'appjs');
  //   script.type = 'module';
  //   script.src = script_path;
  //   script.defer = true;
  //   script.onload = () => {
  //     console.log('App.js loaded and executed');
  //   };

  //   script.onerror = (e) => console.error('Failed to load App.js', e);

  //   document.body.appendChild(script)
  //   appJsLoaded = true;
  // }
  // else
  // {
  //   console.log("dio cane!")
  // }
  // const script = document.createElement('script');
  // script.type = 'module';
  // script.src = '/js/app.js';
  // script.defer = true;
  // script.onload = () => {
  //   console.log('App.js loaded and executed');
  // };

  // script.onerror = (e) => console.error('Failed to load App.js', e);

  // //in this way the script for launching the game is placed after the register.js script but if we press again on /pong routes it add another script with app.js creting an error :(
  // document.body.appendChild(script)

// }
