// levels.js - 5 Rooms with Random Pokémon Positions (5 Pokémon each)
// MODIFIED: Now uses local images only (sprites/pokemon/pkm1.png, etc.)

function generateRoomPokemon(pokemonIds, clues, messages) {
    const positions = [];
    const pokemon = [];
    
    // Generate 5 unique random positions (CHANGED FROM 6 TO 5)
    for (let i = 0; i < 5; i++) {
        positions.push(generateRandomPosition(positions));
    }
    
    // Create Pokémon objects with random positions (5 Pokémon)
    for (let i = 0; i < 5; i++) {
        pokemon.push({
            id: pokemonIds[i],
            x: positions[i].x,
            y: positions[i].y,
            clue: clues[i],
            message: messages[i]
        });
    }
    
    return pokemon;
}

// Generate random position helper
function generateRandomPosition(avoidPositions = [], attempt = 0) {
    if (attempt > 100) {
        const fallbacks = [
            { x: 15, y: 25 }, { x: 35, y: 45 }, { x: 55, y: 35 },
            { x: 25, y: 65 }, { x: 65, y: 25 }, { x: 45, y: 55 },
            { x: 75, y: 45 }, { x: 85, y: 65 }
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    const x = Math.floor(Math.random() * 75) + 10; // 10-85%
    const y = Math.floor(Math.random() * 75) + 10; // 10-85%
    
    let tooClose = false;
    for (const pos of avoidPositions) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        if (distance < 10) {
            tooClose = true;
            break;
        }
    }
    
    if (tooClose) {
        return generateRandomPosition(avoidPositions, attempt + 1);
    }
    
    return { x, y };
}

const LEVELS = [
    // ROOM 1: THE START
    {
        id: 1,
        name: "THE START",
        map: "maps/room1.png",
        answer: "NO GOING BACK FROM THIS",
        pokemon: generateRoomPokemon(
            [1, 2, 3, 4, 5], // 5 Pokémon IDs (CHANGED FROM 6 TO 5)
            ["Pikachu is confused whats opposite of yes?!","Charizard got mad and is going", "Squirtle comes back home", "Bulbasaur also comes From a grass type origin", "Emboar sang a song on This special moment"], // 5 clues (REMOVED "NOW")
            [
                "Pikachu is confused whats opposite of yes?!",
                "Charizard got mad and is going",
                "Squirtle comes back home",
                "Bulbasaur also comes From a grass type origin",
                "Emboar sang a song on This special moment"
                // REMOVED: "Meowth says meow NOW or never!"
            ]
        )
    },

    // ROOM 2: THE COLORED NIGHT
    {
        id: 2,
        name: "THE WHEEZING NIGHT",
        map: "maps/room2.png",
        answer: "WHY AM I PINK COLORED",
        pokemon: generateRoomPokemon(
            [6, 7, 8, 9, 10], // 5 Pokémon IDs (ADJUSTED)
            ["red + white"], // 5 clues (REMOVED "TONIGHT")
            [
                "You step on Meowth's tail and it screams WHY!!!!",
                "AM too sick of eevee",
                "Snorlax slept through **I**sland jourey",
                "Look how beautiful Mew's color is",
                "Vulpix also has an amazing color, its red Colored!"
                // REMOVED: "Psyduck is confused TONIGHT about colors"
            ]
        )
    },

    // ROOM 3: A HEART FELT THANK YOU
    {
        id: 3,
        name: "A HEART FELT THANK YOU (8TH JUNE)",
        map: "maps/room3.png",
        answer: "THANK YOU FOR CHOOSING ME",
        pokemon: generateRoomPokemon(
            [11, 12, 13, 14, 15], // 5 Pokémon IDs (ADJUSTED)
            ["Glad"], // 5 clues (REMOVED "ALWAYS")
            [
                "thank you amor for not skipping psyduck",
                "Ana says, LUCARIO i choose YOU, to take down Growlithe",
                "Poliwag will water you For me",
                "Abra keeps choosing you",
                "Machamp made me masculine."
                // REMOVED: "Geodude is ALWAYS there for you"
            ]
        )
    },

    // ROOM 4: I WILL FOREVER LOVE YOU
    {
        id: 4,
        name: "I WILL FOREVER LOVE YOU",
        map: "maps/room4.png",
        answer: "I WILL FOREVER LOVE YOU",
        pokemon: generateRoomPokemon(
            [16, 17, 18, 19, 20], // 5 Pokémon IDs (ADJUSTED)
            ["infinite"], // 5 clues (REMOVED "MYLOVE")
            [
                "I AND Fuecoco heard your promise!",
                "Gastly WItnessed IllNESS for eternity!",
                "Dratini wrapped us together FOREVERRRRRRR!",
                "Chikorita love watching us and sunset!",
                "Cyndaquil warned you about how addictive I am!!"
                // REMOVED: "Totodile says you are MYLOVE forever"
            ]
        )
    },

    // ROOM 5: ROUND JUST FOR DADDY
    {
        id: 5,
        name: "ROUND JUST FOR DADDY TO SWEET PUNISH YOU",
        map: "maps/room5.png",
        answer: "I WANT TO BE YOURS",
        pokemon: generateRoomPokemon(
            [21, 22, 23, 24, 25], // 5 Pokémon IDs (ADJUSTED)
            ["Yada Yada"], // 5 clues (REMOVED "FOREVER")
            [
                "I and You caught Xerneas on stream",
                "You want this shiny amaura right?",
                "You know i will make you erotically Ho-Oh by the end of this round right?",
                "Daddy has the same pokemon. Its alive, has the same color, but daddy's pokemon wants to be in you",
                "I am not interested in hoppip's hop but i want to see your hops on my *dick*lett"
                // REMOVED: "Sunkern says FOREVER with you!"
            ]
        )
    }
];