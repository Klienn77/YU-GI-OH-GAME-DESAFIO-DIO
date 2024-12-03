const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: { 
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    action: {
        button: document.getElementById("next-duel"),
    },
};

const pathImage = "./src/assets/icons";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImage}/dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImage}/magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImage}/exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

const getRandomCardId = async () => {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

const createCardImage = async (IdCard) => {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");
    return cardImage; 
};

const setCardsField = async (cardId) => {
    await removeAllCardsImages();
    const computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    const duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
};

const updateScore = async () => {
    state.score.scoreBox.innerText = `win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

const drawButton = async (text) => {
    state.action.button.innerText = text;
    state.action.button.style.display = "block";
};

const checkDuelResults = async (playerCardId, computerCardId) => {
    let duelResults = "DRAW"; 
    const playerCard = cardData[playerCardId]; 

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "WIN";
        await playAudio(duelResults);
        state.score.playerScore++;
    } else if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "LOSE";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
};

const removeAllCardsImages = async () => {
    const { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
};

const drawSelectCard = async (index) => {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Attribute: " + cardData[index].type;
};

const drawCards = async (cardNumber, fieldSide) => {
    for (let i = 0; i < cardNumber; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard);
        const fieldElement = document.getElementById(fieldSide);
        if (!fieldElement) {
            console.error(`Elemento com ID ${fieldSide} não encontrado`);
            return;
        }
        fieldElement.appendChild(cardImage);

        if (fieldSide === state.playerSides.player1) {
            cardImage.addEventListener("mouseover", () => {
                drawSelectCard(cardImage.getAttribute("data-id")); 
            });
            cardImage.addEventListener("click", () => {
                setCardsField(cardImage.getAttribute("data-id"));
            });
        }
    }
};

const resetDuel = async () => {
    state.cardsSprites.avatar.src = "";
    state.action.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
};

const playAudio = async (status) => {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
};

const init = () => {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
};

init();


/*Arrow Functions: Refatorei as funções para usar arrow functions onde apropriado, garantindo que o contexto de this seja mantido corretamente.

Consistência de Nomenclatura: Assegurei que todas as funções e variáveis tenham nomes consistentes e significativos.

Verificações de Existência: Adicionei verificações para garantir que os elementos DOM existem antes de operar neles.

Encadeamento Lógico: Melhor estrutura de chamadas de função e responsabilidade de exibição de resultados e atualizações de score.

Nao fiz o refractor extract to method, por estetica "ficou mais elegante com o texto xd".



*/