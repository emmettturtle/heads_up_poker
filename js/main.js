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
const suitMapDir = {c:0, s:1, h:2, d:3}
const valueMapDir = {J:10, Q:11, K:12, A:13}

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
let playerBestFive;
let emmettBestFive;

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
document.getElementById('interface').addEventListener('click', handleClick);

/*----- functions -----*/

initGame();
function initGame () {
    if (emmettBank === 0) {
        message = 'The game is over! You have won! Press new game to play again...';
        renderMessage();
        return;
    } else if (playerBank === 0) {
        message = 'The game is over! Emmett has won! Press new game to play again...';
        renderMessage();
        return;
    }

    round = 1;

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
            message = 'You have won the round! Get ready for the next round!'
            //console.log('yay');
            render();
            setTimeout(initGame, 3000);
            return;
        } else if (handWinner === -1) {
            emmettBank = emmettBank + pot;
            pot = 0;
            message = 'Emmett has won the round! Get ready for the next round!'
            render();
            setTimeout(initGame, 3000);
            return;
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
    if (round === 1) {
        disCommunityCard1.setAttribute('class', 'card back-red');
        disCommunityCard2.setAttribute('class', 'card back-red');
        disCommunityCard3.setAttribute('class', 'card back-red');
        disCommunityCard4.setAttribute('class', 'card back-red');
        disCommunityCard5.setAttribute('class', 'card back-red');
    }
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
    disEmmettCard2.setAttribute('class', 'card ' + emmettHand[1]);
}

function handleClick(evt) {
    if (evt.target === document.getElementById('increase-bet')) {
        playerCurrBet = playerCurrBet + 1;
        renderBets();
    } 
    if (evt.target === document.getElementById('decrease-bet')) {
        if (playerCurrBet > 0) {
            playerCurrBet = playerCurrBet - 1;
        }
        renderBets();
    } 

    if (evt.target === document.getElementById('bet')) {
        pot = pot + playerCurrBet;
        let emmettDoes = emmettDecision();
        if(emmettDoes === 'fold') {
            folds(-1);
            return;
        } else if (emmettDoes === playerCurrBet) {
            emmettCurrBet = emmettDoes;
            round = round + 1;
            render();
            initRound();
        } else if (emmettDoes > playerCurrBet) {
            emmettCurrBet = emmettDoes;
            pot = pot + emmettCurrBet;
            message = 'Emmett has raised! What will you do??';
            render();
        }
    }

    if (evt.target === document.getElementById('check')) {
        let emmettDoes = emmettDecision();
        if (emmettDoes > 0) {
            emmettCurrBet = emmettDoes;
            pot = pot + emmettCurrBet;
            message = 'Emmett has bet! What will you do??';
            render();
        } else if (emmettDoes === 0){
            round = round + 1;
            initRound();
        }
    }

    if (evt.target === document.getElementById('fold')) {
        folds(1);
        return;
    }

    if (evt.target === document.getElementById('new-game')) {
        handWinner = null;
        communityCards = [];
        initGame();
    }
}

function folds(player) { //parameter is 1 if player folds and -1 if emmett folds
    handWinner = player*-1;
    if (player === 1) {
        message = 'You have folded! Emmett has won the round!';
    } else if (player === -1) {
        message = 'Emmett has folded! You have won the round!';
    }
    render();
    setTimeout(initGame, 3000);
}

function emmettDecision () {
    return 10;
}


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

function determineHand(hand) {
    const fullHand = communityCards.concat(hand);
    const hasHands = []
    // format [#1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #j, #q, #k, #a]
    const valueMap = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // format [#clubs, #spaids, #hearts, #diamonds]
    const suitMap = [0,0,0,0];

    //deck in format of suit-value, exs: s03 cK hA
    fullHand.forEach(function(card){
        let cardSuit = card.slice(0, 1);
        let cardVal = card.slice(1);

        suitMap[suitMapDir[cardSuit]] += 1;
        
        if (cardVal === 'J' || cardVal === 'Q' || cardVal === 'K' || cardVal === 'A') {
            valueMap[valueMapDir[cardVal]] += 1;
        } else {
            valueMap[parseInt(cardVal)-1] += 1;
        }
    })
    

    if (flush(suitMap, valueMap, fullHand)) {
        hasHands.push('flush');
    } else if (straight(suitMap, valueMap)) {
        hasHands.push('straight');
    } else if (fourKind(suitMap, valueMap)) {
        hasHands.push('four of a kind');
    } else if (fullHouse(suitMap, valueMap)) {
        hasHands.push('full house');
    } else if (threeKind(suitMap, valueMap)) {
        hasHands.push('three of a kind');
    } else if (pair(suitMap, valueMap)) {
        hasHands.push('pair');
    } else {
        hasHands.push('high card');
    }

}

function findHighCard (cards) {

}

function flush (suitMap, valueMap, fullHand) {
    const flushCards = [];
    let handHighCard;
    const obj = {
        'hasFlush': false,
        'hand': flushCards,
        'highCard': handHighCard
    }

    suitMap.forEach(function(suit, idx) {
        if (suit >= 5) {
            obj.hasFlush = true;
            let thisSuit = Object.keys(suitMapDir)[idx];
            fullHand.forEach(function(card) {
                let cardSuit = card.slice(0, 1);
                let cardVal = card.slice(1);
                if (cardSuit === thisSuit) {
                    flushCards.push(card);
                }
                handHighCard = findHighCard(flushCards);
            });
        }
    });

    return obj;
}
//communityCards = ['s04', 'sA', 's09', 's02', 'dA'];
//determineHand(['s10','d03'])

function straight (suitMap, valueMap) {

}

function fourKind (suitMap, valueMap) {

}

function fullHouse (suitMap, valueMap) {

}

function threeKind (suitMap, valueMap) {

}

function pair (suitMap, valueMap) {

}