import * as THREE from 'three';
import { PlayArea } from './boundary.js';
import { createPaddle } from './paddle.js';
import { createBall } from './ball.js';
import { createLight } from './lights.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { lateralWalls } from './wall.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let gameOver = false;
let leftScore = 0;
let rightScore = 0;
/*
!important note!! for js
	If you ever happen to have the need to load images in your
	Javascript files you must put them in another directory close to the index
	*BECAUSE they will be loaded before the js does and by consequence they
	*will be able to be loaded
*/
// Scene setup
function hideAllPong()
{
	document.getElementById("title").style.display = 'none';
	document.getElementById("menu").style.display = 'none'
}


export function initializeGame3D()
{
	hideAllPong();

	console.log("almento è entrato");
	const scene = new THREE.Scene();
	//! to set up the screen better you need to change the variable that
	//!are in the perspectiveCamera and the one that involves the renderer
	const camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('gameCanvas3d')});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);


	// Play area setup
	const playArea = new PlayArea(40, 60); // Width: 40 units, Depth: 60 units
	scene.add(playArea.mesh);

	const rightWall = lateralWalls();
	rightWall.position.x = playArea.width / 2;
	rightWall.rotateY = 90;
	scene.add(rightWall)

	const leftWall = lateralWalls();
	leftWall.position.x = -playArea.width / 2;
	leftWall.rotateY = 90;
	scene.add(leftWall)

	//! paddles texture
	const loadedSkin = new THREE.TextureLoader();
	const texture = loadedSkin.load('../textures/superSqualo.jpg');

	// Create paddles
	const paddleUpper = createPaddle(texture);
	const paddleUnder = createPaddle(texture);


	scene.add(paddleUpper, paddleUnder);

	// Create ball
	const ball = createBall();
	ball.position.set(0, 1, 0);
	scene.add(ball);

	// Camera setup
	camera.position.set(0, 30, 40);
	camera.lookAt(0, 0, 0);

	// Game state
	let ballDirection = new THREE.Vector3(0, 0, 1); // Moving forward initially
	const ballSpeed = 1;
	const paddleSpeed = 0.5;
	const winningScore = 5;

	// Controls
	const keys = {};
	document.addEventListener('keydown', (e) => keys[e.key] = true);
	document.addEventListener('keyup', (e) => keys[e.key] = false);

	//lights for the game
	const light = createLight();
	scene.add(light);

	//*the font loader is used to load the font for the score but
	//!if you need to make it dynamic you must keep the mesh in a variable
	let font;
	const fontLoader = new FontLoader();
	fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
		font = loadedFont;
		//meshes and geometry are created in the createScoreText function
		//! the first time the font is loaded those must be used in here
		createScoreText();
	});

	//here are the scores variable and the meshes that pratically will the
	//phisical representation of the scores in the game
	//!they are needed in the classic loading of the font
	let rightScoreMesh = null;
	let leftScoreMesh = null;
	let winnerMesh = null;


	//doing the function helps updating the score
	//dynamically because the variables are continually refreshed in the
	//*function's SCOPE
	function createScoreText() {
		// Remove existing score meshes if they exist
		if (leftScoreMesh) scene.remove(leftScoreMesh);
		if (rightScoreMesh) scene.remove(rightScoreMesh);
		if (winnerMesh) scene.remove (winnerMesh);
		// Create new text geometries for the scores
		//* this my friend is the way to create a text geometry to update the mesh and so the score
		const leftScoreGeometry = new TextGeometry(leftScore.toString(), {
			font: font,
			size: 3,
			depth: 1,
			curveSegments: 12,
			bevelEnabled: false
		});
		const rightScoreGeometry = new TextGeometry(rightScore.toString(), {
			font: font,
			size: 3,
			depth: 1,
			curveSegments: 12,
			bevelEnabled: false
		});

		// Create a material for the text
		const material = new THREE.MeshNormalMaterial();

		// Create meshes for the scores
		leftScoreMesh = new THREE.Mesh(leftScoreGeometry, material);
		rightScoreMesh = new THREE.Mesh(rightScoreGeometry, material);

		// Position the score meshes high
		leftScoreMesh.position.set(-10, 20, 0);
		rightScoreMesh.position.set(7, 20, 0);

		// Add the score meshes to the scene
		scene.add(leftScoreMesh);
		scene.add(rightScoreMesh);
	}

	function updateScores(){
		scene.remove(leftScoreMesh);
		scene.remove(rightScoreMesh);

		createScoreText();
		if (leftScore >= winningScore) {
			gameOver = true;
			scene.remove(leftScoreMesh);
			scene.remove(rightScoreMesh);
			document.getElementById('gameOver').style.display = 'block';
			createWinnerText('upper player');
		}
		else if (rightScore >= winningScore){
			gameOver = true;
			scene.remove(leftScoreMesh);
			scene.remove(rightScoreMesh);
			document.getElementById('gameOver').style.display = 'block';
			createWinnerText('Lnicoter');
		}
	}


	function createWinnerText(winner) {
		if (winnerMesh) scene.remove(winnerMesh);
		const winnerGeometry = new TextGeometry(`${winner} wins!`, {
			font: font,
			size: 5,
			depth: 1,
			curveSegments: 12,
			bevelEnabled: false
		});

		const material = new THREE.MeshNormalMaterial();

		winnerMesh = new THREE.Mesh(winnerGeometry, material);
		winnerMesh.position.set(-30, 20, 0);
		scene.add(winnerMesh);
	}


	function updatePaddles() {
		// Left paddle controls (A/D)
		if(keys['a']) paddleUpper.position.x -= paddleSpeed;
		if(keys['d']) paddleUpper.position.x += paddleSpeed;

		// Right paddle controls (←/→)
		if(keys['ArrowLeft']) paddleUnder.position.x -= paddleSpeed;
		if(keys['ArrowRight']) paddleUnder.position.x += paddleSpeed;

		// Keep paddles within bounds
		//*plus 2.5 for the wall size
		const bounds = playArea.getBoundaries();
		[paddleUpper, paddleUnder].forEach(paddle => {
			paddle.position.x = THREE.MathUtils.clamp(
				paddle.position.x,
				bounds.left + 4.2 + 2.5,
				bounds.right - 4.2 - 2.5
			);
		});
	}

	function updateBall() {
		if (gameOver) return;
		// Move ball in depth direction
		ball.position.add(ballDirection.clone().multiplyScalar(ballSpeed));

		//* here we create the collisions area for the ball and the paddles
		const ballBox = new THREE.Box3().setFromObject(ball);
		const paddleUpperBox = new THREE.Box3().setFromObject(paddleUpper);
		const paddleUnderBox = new THREE.Box3().setFromObject(paddleUnder);
		const leftWallBox = new THREE.Box3().setFromObject(leftWall);
		const RightWallBox = new THREE.Box3().setFromObject(rightWall);


		//* intersectsBox simply allows us to see if the paddle and the ball are colliding
		if (ballBox.intersectsBox(paddleUpperBox) || ballBox.intersectsBox(paddleUnderBox))
		{
			ballDirection.z *= -1;

			//add variation to the X direction
			const paddle = ballBox.intersectsBox(paddleUpperBox) ? paddleUpper : paddleUnder;
			//!combination of factors in order to define the future direction of the ball
			const offset = (ball.position.x - paddle.position.x) / paddle.geometry.parameters.width;
			ballDirection.x += offset * 0.5;
			ballDirection.normalize();
		}


		if (ball.position.z < -playArea.depth / 2) {
			rightScore++;
			updateScores();
			resetBall();
		} else if (ball.position.z > playArea.depth / 2) {
			leftScore++;
			updateScores();
			resetBall();
		}

		//* paddle collisions collisions (left/right) same idea as before
		if (ballBox.intersectsBox(leftWallBox) || ballBox.intersectsBox(RightWallBox))
		{
			ballDirection.x *= -1;
		}
	}

	function resetBall(){
		ball.position.set(0,1,0);
		ballDirection.set(0, 0, ballDirection.z > 0 ? 1 : -1);
	}

	const controls = new OrbitControls(camera, renderer.domElement);

	function animate() {
		if (!gameOver)
		{
			requestAnimationFrame(animate);
			updatePaddles();
			updateBall();
			controls.update();
			renderer.render(scene, camera);
		}
	}

	//!menu control function
	// window.start3DGame = function(){
	// 	document.getElementById('menu').style.display = 'none';
	// 	document.getElementById('gameCanvas').style.display = 'block';
	// 	document.getElementById('gameOver').style.display = 'none';

	// }

	window.backToMenu = function(){
		document.getElementById('menu').style.display = 'block';
		document.getElementById('gameCanvas3d').style.display = 'none';
		document.getElementById('gameOver').style.display = 'none';

		console.log("backToMenu triggered");
		gameOver = false;
	}
	gameOver = false;

	paddleUpper.position.set(0, 3, -25);
	paddleUnder.position.set(0, 3, 25);
	createScoreText();
	resetBall();
	animate();
}
/*
	nonce = get_random_string(16)
	csrf_token = get_token(request)
	csp_policy = (f"script-src 'self' 'nonce-{nonce}' blob:; ")
	response = render(request, 'main.html', {'csrf_token': csrf_token, 'nonce': nonce})
	response["Content-Security-Policy"] = csp_policy
	return response

	!find a variant for the html file
*/
