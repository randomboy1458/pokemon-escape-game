// Final gift message
const FINAL_GIFT_MESSAGE = "A LIFE WITH SOMEONE WHO IS OBSESSED WITH YOU, CRAVES FOR YOU. AND WILL FOREVER LOVE YOU AND PUT ALL THE EFFORTS YOU COULD EVER IMAGINE.";

// script.js - Complete Game Logic
class PokemonEscapeRoom {
    constructor() {
        // Game state
        this.currentRoom = 1;
        this.player = {
            x: 50,
            y: 50,
            speed: 1.8 // REDUCED from 2.5 to 1.8 for slower movement
        };
        this.caughtPokemon = [];
        this.collectedClues = [];
        this.gameLoaded = false;
        
        // DOM Elements cache
        this.elements = {};
        
        // Initialize
        this.initialize();
    }
    
    async initialize() {
        await this.cacheElements();
        this.setupEventListeners();
    }
    
    async cacheElements() {
        // Cache all DOM elements
        this.elements = {
            // Screens
            agreementScreen: document.getElementById('agreement-screen'),
            loadingScreen: document.getElementById('loading-screen'),
            gameScreen: document.getElementById('game-screen'),
            
            // Agreement Screen
            acceptButton: document.getElementById('accept-btn'),
            
            // Loading
            loadingProgress: document.getElementById('loading-progress'),
            loadingText: document.getElementById('loading-text'),
            startButton: document.getElementById('start-game'),
            
            // Game UI
            currentRoom: document.getElementById('current-room'),
            roomTitle: document.getElementById('room-title'),
            caughtCount: document.getElementById('caught-count'),
            totalPokemon: document.getElementById('total-pokemon'),
            cluesCount: document.getElementById('clues-count'),
            
            // Map
            mapImage: document.getElementById('map-image'),
            player: document.getElementById('player'),
            pokemonContainer: document.getElementById('pokemon-container'),
            
            // Controls
            btnUp: document.getElementById('btn-up'),
            btnDown: document.getElementById('btn-down'),
            btnLeft: document.getElementById('btn-left'),
            btnRight: document.getElementById('btn-right'),
            btnA: document.getElementById('btn-a'),
            btnB: document.getElementById('btn-b'),
            btnAnswer: document.getElementById('btn-answer'),
            
            // Clues
            cluesList: document.getElementById('clues-list'),
            
            // Modals
            catchModal: document.getElementById('catch-modal'),
            answerModal: document.getElementById('answer-modal'),
            penaltyModal: document.getElementById('penalty-modal'),
            successModal: document.getElementById('success-modal'),
            victoryScreen: document.getElementById('victory-screen'),
            
            // Catch Modal
            closeCatch: document.getElementById('close-catch'),
            caughtPokemonImg: document.getElementById('caught-pokemon-img'),
            caughtPokemonName: document.getElementById('caught-pokemon-name'),
            caughtMessage: document.getElementById('caught-message'),
            clueText: document.getElementById('clue-text'),
            
            // Answer Modal
            closeAnswer: document.getElementById('close-answer'),
            roomAnswer: document.getElementById('room-answer'),
            currentCluesHint: document.getElementById('current-clues-hint'),
            submitAnswer: document.getElementById('submit-answer'),
            penaltyHint: document.getElementById('penalty-hint'),
            answerFeedback: document.getElementById('answer-feedback'),
            
            // Penalty Modal
            penaltyText: document.getElementById('penalty-text'),
            completePenalty: document.getElementById('complete-penalty'),
            skipPenalty: document.getElementById('skip-penalty'),
            
            // Success Modal
            completedRoom: document.getElementById('completed-room'),
            nextRoomNum: document.getElementById('next-room-num'),
            nextRoomBtn: document.getElementById('next-room-btn'),
            
            // Victory Screen
            finalGiftMessage: document.getElementById('final-gift-message'),
            restartGame: document.getElementById('restart-game'),
            
            // ===== JOYSTICK ELEMENTS =====
            joystickHandle: document.getElementById('joystickHandle'),
            pButton: document.getElementById('pButton'),
            gamePanel: document.getElementById('gamePanel'),
            closePanel: document.getElementById('closePanel'),
            panelAnswerBtn: document.getElementById('panelAnswerBtn'),
            panelCluesList: document.getElementById('panelCluesList'),
            panelCaughtCount: document.getElementById('panelCaughtCount'),
            panelTotalPokemon: document.getElementById('panelTotalPokemon'),
            panelRoomNumber: document.getElementById('panelRoomNumber')
        };
    }
    
    setupEventListeners() {
        // Agreement Screen
        this.elements.acceptButton.addEventListener('click', () => this.startLoading());
        
        // Start Game (from loading screen)
        this.elements.startButton.addEventListener('click', () => this.startGame());
        
        // Movement Controls
        this.elements.btnUp.addEventListener('click', () => this.movePlayer('up'));
        this.elements.btnDown.addEventListener('click', () => this.movePlayer('down'));
        this.elements.btnLeft.addEventListener('click', () => this.movePlayer('left'));
        this.elements.btnRight.addEventListener('click', () => this.movePlayer('right'));
        
        // Action Button (A)
        this.elements.btnA.addEventListener('click', () => this.interact());
        
        // Answer Button
        this.elements.btnAnswer.addEventListener('click', () => this.showAnswerModal());
        
        // Close Modals
        this.elements.closeCatch.addEventListener('click', () => this.closeCatchModal());
        this.elements.closeAnswer.addEventListener('click', () => this.closeAnswerModal());
        
        // Answer Submission
        this.elements.submitAnswer.addEventListener('click', () => this.checkAnswer());
        this.elements.roomAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        
        // Penalty
        this.elements.penaltyHint.addEventListener('click', () => this.showPenaltyModal());
        this.elements.completePenalty.addEventListener('click', () => this.giveHint());
        this.elements.skipPenalty.addEventListener('click', () => this.closePenaltyModal());
        
        // Next Room
        this.elements.nextRoomBtn.addEventListener('click', () => this.nextRoom());
        
        // Restart Game
        this.elements.restartGame.addEventListener('click', () => this.restartGame());
        
        // Touch events for better mobile experience
        this.setupTouchEvents();
        
        // Keyboard support for testing
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    startLoading() {
        // Hide agreement screen
        this.elements.agreementScreen.classList.remove('active');
        this.elements.agreementScreen.classList.add('hidden');
        
        // Show loading screen
        this.elements.loadingScreen.classList.remove('hidden');
        this.elements.loadingScreen.classList.add('active');
        
        // Start loading animation
        this.setupLoading();
    }
    
    setupLoading() {
        let progress = 0;
        const loadingMessages = [
            "Preparing romantic adventure...",
            "Loading sweet memories...",
            "Summoning cute Pokémon...",
            "Setting up special surprises...",
            "Almost ready for you, my love!"
        ];
        
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                this.elements.loadingText.textContent = "Ready to start!";
                this.elements.startButton.disabled = false;
                
                // Make button pulse
                this.elements.startButton.style.animation = 'pulse-accept 1.5s infinite';
            }
            this.elements.loadingProgress.style.width = `${progress}%`;
            
            // Change loading text at intervals
            const messageIndex = Math.floor(progress / 20);
            if (messageIndex < loadingMessages.length) {
                this.elements.loadingText.textContent = loadingMessages[messageIndex];
            }
        }, 300);
    }
    
    startGame() {
        // Hide loading screen
        this.elements.loadingScreen.classList.remove('active');
        this.elements.loadingScreen.classList.add('hidden');
        
        // Show game screen
        this.elements.gameScreen.classList.remove('hidden');
        this.elements.gameScreen.classList.add('active'); // Add active class for joystick
        
        // Load first room
        this.loadRoom(this.currentRoom);
        this.gameLoaded = true;
        
        // Setup joystick system
        this.setupJoystick();
        
        // Log for debugging
        console.log("🎮 Game started! Room 1 loaded.");
    }
    
    setupTouchEvents() {
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent zoom on double tap
        let lastTap = 0;
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault();
            }
            lastTap = currentTime;
        }, false);
    }
    
    handleKeyPress(e) {
        if (!this.gameLoaded) return;
        
        // FIX: Allow typing in answer modal
        if (!this.elements.answerModal.classList.contains('hidden')) {
            return; // Let user type normally in answer input
        }
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.movePlayer('up');
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.movePlayer('down');
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.movePlayer('left');
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.movePlayer('right');
                e.preventDefault();
                break;
            case ' ':
                this.interact();
                e.preventDefault();
                break;
            case 'Enter':
                this.interact();
                e.preventDefault();
                break;
        }
    }
    
    // ===== JOYSTICK SYSTEM =====
    setupJoystick() {
        const joystickHandle = this.elements.joystickHandle;
        const joystickBase = document.querySelector('.joystick-base');
        const pButton = this.elements.pButton;
        const gamePanel = this.elements.gamePanel;
        const closePanel = this.elements.closePanel;
        const panelAnswerBtn = this.elements.panelAnswerBtn;
        
        if (!joystickHandle) return;
        
        let isDragging = false;
        let startX, startY;
        let baseRect;
        let lastMoveTime = 0;
        const moveDelay = 120; // INCREASED from 50 to 120ms for slower joystick movement
        
        // Touch/Click start
        const startDrag = (clientX, clientY) => {
            isDragging = true;
            baseRect = joystickBase.getBoundingClientRect();
            startX = baseRect.left + baseRect.width / 2;
            startY = baseRect.top + baseRect.height / 2;
            updateJoystick(clientX, clientY);
        };
        
        // Update joystick position and movement
        const updateJoystick = (clientX, clientY) => {
            if (!isDragging) return;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 30; // INCREASED for more joystick travel
            
            // Limit joystick movement
            const angle = Math.atan2(deltaY, deltaX);
            const limitedDistance = Math.min(distance, maxDistance);
            
            const joyX = Math.cos(angle) * limitedDistance;
            const joyY = Math.sin(angle) * limitedDistance;
            
            joystickHandle.style.transform = `translate(${joyX}px, ${joyY}px)`;
            
            // ===== ADJUSTED THRESHOLD =====
            // Higher number = less sensitive, Lower number = more sensitive
            const threshold = 18; // ADJUSTED from 20 to 18 for better balance with slower movement
            // ===== END THRESHOLD =====
            
            let direction = null;
            
            // Only move if joystick is pushed significantly
            if (Math.abs(joyX) > threshold || Math.abs(joyY) > threshold) {
                // Check which axis has stronger movement
                if (Math.abs(joyX) > Math.abs(joyY)) {
                    direction = joyX > 0 ? 'right' : 'left';
                } else {
                    direction = joyY > 0 ? 'down' : 'up';
                }
                
                // Throttle movement to prevent too fast movement
                const now = Date.now();
                if (now - lastMoveTime > moveDelay) {
                    this.movePlayer(direction);
                    lastMoveTime = now;
                }
            }
        };
        
        // Stop dragging
        const stopDrag = () => {
            if (isDragging) {
                isDragging = false;
                joystickHandle.style.transform = 'translate(0, 0)';
                lastMoveTime = 0;
            }
        };
        
        // Touch events
        joystickHandle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        });
        
        joystickHandle.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', stopDrag);
        document.addEventListener('touchcancel', stopDrag);
        
        // Mouse events for testing
        joystickHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                updateJoystick(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('mouseup', stopDrag);
        
        // P-Button click
        pButton.addEventListener('click', () => {
            this.showGamePanel();
        });
        
        // Close panel
        closePanel.addEventListener('click', () => {
            this.hideGamePanel();
        });
        
        // Answer button in panel
        panelAnswerBtn.addEventListener('click', () => {
            this.showAnswerModal();
            this.hideGamePanel();
        });
    }
    
    showGamePanel() {
        const room = LEVELS[this.currentRoom - 1];
        
        // Update panel info
        this.elements.panelCaughtCount.textContent = this.caughtPokemon.length;
        this.elements.panelTotalPokemon.textContent = room.pokemon.length;
        this.elements.panelRoomNumber.textContent = this.currentRoom;
        
        // Update clues in panel
        this.elements.panelCluesList.innerHTML = '';
        this.collectedClues.forEach(clue => {
            const clueElement = document.createElement('div');
            clueElement.className = 'panel-clue-item';
            clueElement.textContent = clue;
            this.elements.panelCluesList.appendChild(clueElement);
        });
        
        // Show panel
        this.elements.gamePanel.classList.add('active');
    }
    
    hideGamePanel() {
        this.elements.gamePanel.classList.remove('active');
    }
    // ===== END JOYSTICK SYSTEM =====
    
    loadRoom(roomNumber) {
        const room = LEVELS[roomNumber - 1];
        
        // Reset room state
        this.caughtPokemon = [];
        this.collectedClues = [];
        this.player.x = 50;
        this.player.y = 50;
        
        // Hide game panel
        this.hideGamePanel();
        
        // Update UI
        this.elements.currentRoom.textContent = roomNumber;
        this.elements.roomTitle.textContent = room.name;
        this.elements.totalPokemon.textContent = room.pokemon.length;
        this.elements.caughtCount.textContent = '0';
        this.elements.cluesCount.textContent = '0';
        this.elements.cluesList.innerHTML = '';
        this.elements.btnAnswer.disabled = true;
        
        // Load map
        this.elements.mapImage.src = room.map;
        
        // Update player position
        this.updatePlayerPosition();
        
        // Place Pokémon with random positions
        this.placePokemon(room.pokemon);
        
        // Update next room button
        if (roomNumber < 5) {
            this.elements.nextRoomNum.textContent = roomNumber + 1;
            this.elements.completedRoom.textContent = roomNumber;
        }
        
        // Log Pokémon positions for debugging
        console.log(`Room ${roomNumber} Pokémon positions:`);
        room.pokemon.forEach((pkm, i) => {
            console.log(`Pokémon ${i+1}: ${pkm.x}%, ${pkm.y}%`);
        });
    }
    
    placePokemon(pokemonList) {
        this.elements.pokemonContainer.innerHTML = '';
        
        pokemonList.forEach((pkm, index) => {
            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'pokemon hidden';
            pokemonElement.id = `pokemon-${index}`;
            pokemonElement.dataset.index = index;
            pokemonElement.dataset.pokemonId = pkm.id;
            
            // Apply random position
            pokemonElement.style.left = `${pkm.x}%`;
            pokemonElement.style.top = `${pkm.y}%`;
            
            // Add Pokémon sprite
            const pokemonData = POKEMON_DATA[pkm.id];
            if (pokemonData) {
                const sprite = document.createElement('img');
                sprite.src = pokemonData.sprite;
                sprite.alt = pokemonData.name;
                sprite.className = 'pokemon-sprite';
                sprite.title = `${pokemonData.name} - ${pkm.clue}`;
                pokemonElement.appendChild(sprite);
            }
            
            this.elements.pokemonContainer.appendChild(pokemonElement);
        });
    }
    
    movePlayer(direction) {
        const oldX = this.player.x;
        const oldY = this.player.y;
        
        switch(direction) {
            case 'up':
                this.player.y = Math.max(5, this.player.y - this.player.speed);
                break;
            case 'down':
                this.player.y = Math.min(95, this.player.y + this.player.speed);
                break;
            case 'left':
                this.player.x = Math.max(5, this.player.x - this.player.speed);
                break;
            case 'right':
                this.player.x = Math.min(95, this.player.x + this.player.speed);
                break;
        }
        
        // Update player position
        this.updatePlayerPosition();
        
        // Check for Pokémon encounters
        this.checkForPokemon();
    }
    
    updatePlayerPosition() {
        this.elements.player.style.left = `${this.player.x}%`;
        this.elements.player.style.top = `${this.player.y}%`;
    }
    
    checkForPokemon() {
        const room = LEVELS[this.currentRoom - 1];
        
        room.pokemon.forEach((pkm, index) => {
            // Skip if already caught
            if (this.caughtPokemon.includes(index)) return;
            
            // Calculate distance between player and Pokémon
            const distance = Math.sqrt(
                Math.pow(this.player.x - pkm.x, 2) + 
                Math.pow(this.player.y - pkm.y, 2)
            );
            
            // If close enough (within 10%)
            if (distance < 10) {
                this.catchPokemon(index);
            }
        });
    }
    
    interact() {
        // Check for Pokémon when A button is pressed
        this.checkForPokemon();
    }
    
    catchPokemon(index) {
        // Skip if already caught
        if (this.caughtPokemon.includes(index)) return;
        
        const room = LEVELS[this.currentRoom - 1];
        const pokemon = room.pokemon[index];
        const pokemonData = POKEMON_DATA[pokemon.id];
        
        // Add to caught list
        this.caughtPokemon.push(index);
        this.collectedClues.push(pokemon.clue);
        
        // Update caught count
        this.elements.caughtCount.textContent = this.caughtPokemon.length;
        this.elements.cluesCount.textContent = this.collectedClues.length;
        
        // Update Pokémon appearance - this makes it vanish completely
        const pokemonElement = document.getElementById(`pokemon-${index}`);
        if (pokemonElement) {
            pokemonElement.classList.remove('hidden');
            pokemonElement.classList.add('caught');
        }
        
        // Add clue to display
        this.addClueToDisplay(pokemon.clue);
        
        // Show catch modal
        this.showCatchModal(pokemonData, pokemon);
        
        // Check if all Pokémon caught
        if (this.caughtPokemon.length === room.pokemon.length) {
            this.elements.btnAnswer.disabled = false;
        }
    }
    
    addClueToDisplay(clue) {
        const clueElement = document.createElement('div');
        clueElement.className = 'clue-item';
        clueElement.textContent = clue;
        this.elements.cluesList.appendChild(clueElement);
    }
    
    showCatchModal(pokemonData, pokemon) {
        this.elements.caughtPokemonImg.src = pokemonData.sprite;
        this.elements.caughtPokemonName.textContent = pokemonData.name;
        this.elements.caughtMessage.textContent = pokemon.message;
        this.elements.clueText.textContent = pokemon.clue;
        
        this.elements.catchModal.classList.remove('hidden');
    }
    
    closeCatchModal() {
        this.elements.catchModal.classList.add('hidden');
    }
    
    showAnswerModal() {
        const room = LEVELS[this.currentRoom - 1];
        
        // Update clues hint
        this.elements.currentCluesHint.textContent = 
            `Clues: ${this.collectedClues.join(' + ')}`;
        
        // Clear previous feedback
        this.elements.answerFeedback.className = 'feedback';
        this.elements.answerFeedback.innerHTML = '';
        this.elements.roomAnswer.value = '';
        
        this.elements.answerModal.classList.remove('hidden');
        this.elements.roomAnswer.focus();
    }
    
    closeAnswerModal() {
        this.elements.answerModal.classList.add('hidden');
    }
    
    checkAnswer() {
        const userAnswer = this.elements.roomAnswer.value.trim().toUpperCase();
        const room = LEVELS[this.currentRoom - 1];
        const correctAnswer = room.answer.toUpperCase();
        
        // Flexible matching
        const normalizedUser = userAnswer.replace(/\s+/g, '');
        const normalizedCorrect = correctAnswer.replace(/\s+/g, '');
        
        if (normalizedUser === normalizedCorrect) {
            this.showSuccess();
        } else {
            this.showWrongAnswer();
        }
    }
    
    showSuccess() {
        this.elements.answerFeedback.className = 'feedback success';
        this.elements.answerFeedback.innerHTML = '✅ Correct! Room completed!';
        
        setTimeout(() => {
            this.closeAnswerModal();
            this.elements.successModal.classList.remove('hidden');
        }, 1000);
    }
    
    showWrongAnswer() {
        this.elements.answerFeedback.className = 'feedback error';
        this.elements.answerFeedback.innerHTML = 
            'Oopsies you got this wrong, try again or complete the two penalties for a hint by daddy! (its fair, one penalty is a part of this game and one is need of daddy)!';
        
        this.currentWrongAnswer = this.elements.roomAnswer.value;
    }
    
    showPenaltyModal() {
        const penaltyTasks = [
            "OBEY WHAT DADDY SAYS TO YOU!",
            "Say 'I'm yours forever' 3 times in any public server (not homies)",
            "Send a very cheesy and horny picture to daddy!",
            "Promise to be a good girl tonight!",
            "Admit you need daddy TINY (HARSH) on 1840 megaphone! 😈"
        ];
        
        const randomIndex = Math.floor(Math.random() * penaltyTasks.length);
        this.elements.penaltyText.textContent = penaltyTasks[randomIndex];
        
        this.elements.penaltyModal.classList.remove('hidden');
    }
    
    closePenaltyModal() {
        this.elements.penaltyModal.classList.add('hidden');
        this.elements.roomAnswer.focus();
    }
    
    giveHint() {
        const room = LEVELS[this.currentRoom - 1];
        const answer = room.answer;
        
        let hint = '';
        if (answer.length <= 10) {
            hint = `Hint: The answer starts with "${answer[0]}" and ends with "${answer[answer.length-1]}"`;
        } else {
            const randomPos = Math.floor(Math.random() * answer.length);
            hint = `Hint: The answer has ${answer.length} characters. ` +
                   `Character ${randomPos+1} is "${answer[randomPos]}"`;
        }
        
        this.closePenaltyModal();
        this.elements.answerFeedback.className = 'feedback success';
        this.elements.answerFeedback.innerHTML = `💖 Daddy's Hint: ${hint}`;
        this.elements.roomAnswer.focus();
    }
    
    nextRoom() {
        this.elements.successModal.classList.add('hidden');
        
        if (this.currentRoom < 5) {
            this.currentRoom++;
            this.loadRoom(this.currentRoom);
        } else {
            this.showVictoryScreen();
        }
    }
    
    showVictoryScreen() {
        this.elements.finalGiftMessage.textContent = FINAL_GIFT_MESSAGE;
        this.elements.victoryScreen.classList.remove('hidden');
    }
    
    restartGame() {
        this.currentRoom = 1;
        this.elements.victoryScreen.classList.add('hidden');
        this.loadRoom(this.currentRoom);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Prevent default touch behaviors
    document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) e.preventDefault();
    }, { passive: false });
    
    // Start the game
    window.game = new PokemonEscapeRoom();
    
    // Log for debugging
    console.log("🎮 Pokémon Escape Game initialized!");
    console.log("📱 Waiting for user to accept agreement...");
});