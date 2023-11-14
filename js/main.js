/*----- constants -----*/
//deck in format of suit-value, exs: s03 cK hA
const suits = ['s', 'c', 'd', 'h'];
const values = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const deck = buildDeck();
const handRanks = [
    'royal flush',
    'straight flush',
    'four of a kind',
    'full house',
    'flush',
    'straight',
    'three of a kind',
    'two pair',
    'pair',
    'high card'
];

/*----- state variables -----*/
let currentRound; //tracks round
let playerHand; //arr of 2 cards
let emmettHand;
let communityCards; //arr of 5 cards
let shuffledDeck;
let pot;
let handWinner; //null, 1 (player), -1 (Emmett), T for tie
let gameWinner; //null, 1 (player), -1 (Emmett), T for tie
let playerBank; 
let emmettBank;
let emmettCurrBet;
let playerCurrBet;


/*----- cached elements  -----*/
const disPlayerBet = document.getElementById('player-bet-value');
const disEmmettBet = document.getElementById('emmett-bet-value');
const disPot = document.getElementById('pot-value');
const disPlayerCard1 = document.getElementById('player-card1');
const disPlayerCard2 = document.getElementById('player-card2');
const disEmmettCard1 = document.getElementById('emmett-card1');
const disEmmettCard2 = document.getElementById('emmett-card2');
const disPlayerBank = document.getElementById('player-bank-value');
const disEmmettBank = document.getElementById('emmett-bank-value');
const disCommunityCard1 = document.getElementById('card1');
const disCommunityCard2 = document.getElementById('card2');
const disCommunityCard3 = document.getElementById('card3');
const disCommunityCard4 = document.getElementById('card4');
const disCommunityCard5 = document.getElementById('card5');
const disMessage = document.getElementById('message');



/*----- event listeners -----*/


/*----- functions -----*/

initGame();
function initGame () {
    shuffledDeck = shuffleDeck();
    //deal hands
    playerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
    emmettHand = [shuffledDeck.pop(), shuffledDeck.pop()];
    //assign all 5 community cards
    communityCards = [
        shuffledDeck.pop(), 
        shuffledDeck.pop(), 
        shuffledDeck.pop(),
        shuffledDeck.pop(),
        shuffledDeck.pop() 
    ];

    round = 1;

    if (handWinner === 1) {
        playerBank = playerBank + pot;
        pot = 0;
    } else if (handWinner === -1) {
        emmettBank = emmettBank + pot;
        pot = 0;
    } else {
        emmettBank = 200;
        playerBank = 200;
        pot = 0;
    }

    playerCurrBet = 0;
    emmettCurrBet = 0;
    pot = 0;
    initRound();
}

function initRound() {
    if (round < 5) {
        pot = playerCurrBet + emmettCurrBet;
        playerCurrBet = 0;
        emmettCurrBet = 0;
        message = 'Your turn!';
    } else if (round === 5) {
        handWinner = compareHands();
        renderEmmettHand();
        if (handWinner === 1) { //if player wins
            playerBank = playerBank + pot;
            pot = 0;
            if (emmettBank === 0)  {
                gameWinner = 1;
                handWinner = null;
                // console.log('tou beat emmett');
                message = 'You have beaten Emmett in Poker!!!';
            } else {
                message = 'You have won the round! Get ready for the next round!'
                //console.log('yay');
                render();
                setTimeout(initGame, 3000);
                return;
            }
        } else if (handWinner === -1) {
            emmettBank = emmettBank + pot;
            pot = 0;
            if (playerBank === 0) {
                gameWinner = -1;
                handWinner = null;
                message = 'You have lost to Emmett in Poker!!!';
            } else {
                message = 'Emmett has won the round! Get ready for the next round!'
                render();
                setTimeout(initGame, 3000);
                return;
            }
        } else if (handWinner === 'T') {
            let potRem = pot % 2;
            let evenPot = pot - potRem;
            emmettBank = emmettBank + evenPot/2;
            playerBank = playerBank + potRem + evenPot/2;
            pot = 0;
            message = 'You have tied! The pot has been split.'
            // console.log(emmettBank)
            // console.log(playerBank)
            render();
            setTimeout(initGame, 3000);
            return;
        }
    }
    render();
}

function render () {
    renderBets();
    renderBanks();
    renderPot();
    renderCommunityCards();
    renderPlayerHand();
    renderMessage();
}

function renderBets() {
    disPlayerBet.innerText = playerCurrBet.toString();
    disEmmettBet.innerText = emmettCurrBet.toString();
}

function renderBanks() {
    disEmmettBank.innerText = emmettBank.toString();
    disPlayerBank.innerText = playerBank.toString();
}

function renderPot() {
    disPot.innerText = pot.toString();
}

function renderCommunityCards () {
    if (round >= 2) {
        disCommunityCard1.setAttribute('class', 'card ' + communityCards[0]);
        disCommunityCard2.setAttribute('class', 'card ' + communityCards[1]);
        disCommunityCard3.setAttribute('class', 'card ' + communityCards[2]);
    }

    if (round >= 3) {
        disCommunityCard4.setAttribute('class', 'card ' + communityCards[3]);
    }
    
    if (round >= 4) {
        disCommunityCard5.setAttribute('class', 'card ' + communityCards[4]);
    }
}

function renderPlayerHand() {
    disPlayerCard1.setAttribute('class', 'card ' + playerHand[0]);
    disPlayerCard2.setAttribute('class', 'card ' + playerHand[1]);
}

function renderMessage () {
    disMessage.innerText = message;
}

function renderEmmettHand () {
    disEmmettCard1.setAttribute('class', 'card ' + emmettHand[0]);
    disEmmettCard2.setAttribute('class', 'card ' + emmettHand[1]);}

//render community cards: if round 1 render 3, if round2 render 4, etc
function compareHands() {

}

function shuffleDeck() {
    const tempDeck = [...deck];
    const thisShuffledDeck = [];

    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        let randomCard = tempDeck.splice(rndIdx, 1);
        thisShuffledDeck.push(randomCard[0]);
    }

    return thisShuffledDeck;
}

function buildDeck() {
    const deck = [];

    suits.forEach(function(suit){
        values.forEach(function(value){
            deck.push(suit+value);
        });
    });

    return deck;
}