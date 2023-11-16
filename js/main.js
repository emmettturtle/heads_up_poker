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
const valueMapDir = {J:9, Q:10, K:11, A:12}

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
let raiseRound;

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

initNewGame();
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
    renderHideEmmett();
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

    playerCurrBet = 0;
    emmettCurrBet = 0;
    pot = 0;
    initRound();
}

function initNewGame () {
    handWinner = null;
    gameWinner = null;
    emmettBank = 200;
    playerBank = 200;
    communityCards = [];
    renderHideEmmett;
    initGame();
}

function initRound() {
    if (round < 5) {
        pot = pot + playerCurrBet + emmettCurrBet;
        emmettBank = emmettBank - emmettCurrBet;
        playerCurrBet = 0;
        emmettCurrBet = 0;
        message = 'Your turn!';
    } else if (round === 5) {
        handWinner = compareHands();
        renderEmmettHand();
        pot = pot + playerCurrBet + emmettCurrBet;
        emmettBank = emmettBank - emmettCurrBet;
        playerCurrBet = 0;
        emmettCurrBet = 0;
        if (handWinner === 1) { //if player wins
            playerBank = playerBank + pot;
            pot = 0;
            message = 'You have won the round! Get ready for the next round!'
            //console.log('yay');
            render();
            setTimeout(initGame, 5000);
            return;
        } else if (handWinner === -1) {
            emmettBank = emmettBank + pot;
            pot = 0;
            message = 'Emmett has won the round! Get ready for the next round!'
            render();
            setTimeout(initGame, 5000);
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
            setTimeout(initGame, 5000);
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

function renderHideEmmett () {
    disEmmettCard1.setAttribute('class', 'card back-red');
    disEmmettCard2.setAttribute('class', 'card back-red');
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
        playerBank = playerBank - 1;
        renderBets();
    } 
    if (evt.target === document.getElementById('decrease-bet')) {
        if (playerCurrBet > 0) {
            playerCurrBet = playerCurrBet - 1;
            playerBank = playerBank + 1;
        }
        renderBets();
    } 

    if (evt.target === document.getElementById('bet')) {
        if (playerCurrBet > 0){
            //pot = pot + playerCurrBet;
            let emmettDoes = emmettDecision();
            if(emmettDoes === 'fold') {
                folds(-1);
                return;
            } else if (emmettDoes === playerCurrBet) {
                emmettCurrBet = emmettDoes;
                round = round + 1;
                message = 'Emmett Checks!';
                render();
                setTimeout(initRound, 1200);
            } else if (emmettDoes > playerCurrBet) {
                emmettCurrBet = emmettDoes;
                // pot = pot + emmettCurrBet;
                raiseRound = 1;
                message = 'Emmett has raised! What will you do??';
                render();
            }
        }
    }

    if (evt.target === document.getElementById('check')) {
        let emmettDoes = emmettDecision();
        if (emmettDoes > 0) {
            emmettCurrBet = emmettDoes;
            // pot = pot + emmettCurrBet;
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
        initNewGame();
    }
}

function folds(player) { //parameter is 1 if player folds and -1 if emmett folds
    handWinner = player*-1;
    pot = pot + emmettCurrBet + playerCurrBet;
    emmettBank = emmettBank - emmettCurrBet;
    playerBank = playerBank - playerCurrBet;
    emmettCurrBet = 0;
    playerCurrBet = 0;
    if (player === 1) {
        message = 'You have folded! Emmett has won the round!';
        emmettBank = emmettBank + pot;
    } else if (player === -1) {
        message = 'Emmett has folded! You have won the round!';
        playerBank = playerBank + pot;
    }
    render();
    setTimeout(initGame, 5000);
}

function emmettDecision () {
    
    let retBet;
    let ranNum = Math.floor(Math.random() * 30);
    //most of the time check
    if (ranNum <= 15) {
        retBet = playerCurrBet;
    } else if (ranNum > 15) {
        let ranBet = Math.floor(Math.random() * 4);
        retBet = playerCurrBet+(ranBet*10);
    } 
    
    if (round === 4 && ranNum > 25) {
        retBet = emmettBank;
    }

    let ranFold = Math.floor(Math.random() * 3);
    if(playerCurrBet > 45 && ranFold === 2) {
        retBet = 'fold'
    }

    if (retBet !== 'fold' && retBet !== 0 && (!retBet || retBet > emmettBank)) {
        retBet = emmettDecision();
    }

    if (raiseRound) {
        retBet = playerCurrBet;
    }

    return retBet;
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


function compareHands() {
    //compare the rank of players hand and Emmetts hand
    //return the winner 1,-1
    //if the hands rank the same
    //compare the high cards of the hands and whichever is higher wins
    let winner = null;
    const playerHandObj = determineHand(playerHand);
    const emmettHandObj = determineHand(emmettHand);

    let playerHandRank = handRanks.indexOf(playerHandObj.highestRankingHand);
    let emmettHandRank = handRanks.indexOf(emmettHandObj.highestRankingHand);
    //lower the hand Rank # the higher it is
    // console.log(playerHandObj)
    // console.log(emmettHandObj)
    // console.log(playerHandRank)
    // console.log(emmettHandRank)
    if (playerHandRank < emmettHandRank) {
        winner = 1;
    } else if (emmettHandRank < playerHandRank) {
        winner = -1;
    } else if (emmettHandRank === playerHandRank) {
        let playerHighCardVal = parseInt(faceToVal(playerHandObj.highCardOfBestHand.slice(1)));
        let emmettHighCardVal = parseInt(faceToVal(emmettHandObj.highCardOfBestHand.slice(1)));
        if (playerHighCardVal > emmettHighCardVal) {
            winner = 1;
        } else if (emmettHighCardVal > playerHighCardVal) {
            winner = -1;
        } else if (emmettHighCardVal === playerHighCardVal) {
            // console.log('are we here')
            let playerHandHighCardVal = parseInt(faceToVal(findHighCard(playerHand).slice(1)));
            let emmettHandHighCardVal = parseInt(faceToVal(findHighCard(emmettHand).slice(1)));
            if (playerHandHighCardVal > emmettHandHighCardVal) {
                winner = 1;
            } else if (emmettHandHighCardVal > playerHandHighCardVal) {
                winner = -1;
            } else if (emmettHandHighCardVal === playerHandHighCardVal) {
                winner = 'T';
            }
        }
    }
    return winner;
}

function faceToVal (cardVal) {
    if (cardVal === 'A' || cardVal === 'K' || cardVal === 'Q' || cardVal === 'J') {
        cardVal = valueMapDir[cardVal] + 2;
    }
    return cardVal;
}

// emmettHand = ['sQ', 's09']
// playerHand = ['sJ', 'cJ']
// communityCards = ['s02', 'sA', 'd05', 'd07', 'd08']

// emmettHand = ['c07', 's04']
// playerHand = ['s05', 'sA']
// communityCards = ['s09', 'd10', 'c02', 'c03', 'h10']

function determineHand(hand) {
    const fullHand = communityCards.concat(hand);
    const handRankObj = {
        hasHands: [],
        highCards: [],
        highestRankingHand: 'high card',
        highCardOfBestHand: null
    };
    const mapObj = createMaps(fullHand);
    // straight(suitMap, valueMap, fullHand);
    const flushObj = flush(mapObj.suit, mapObj.value, fullHand);
    const quadObj = fourKind(mapObj.suit, mapObj.value, fullHand);
    const tripObj = threeKind(mapObj.suit, mapObj.value, fullHand);
    const pairObj = pair(mapObj.suit, mapObj.value, fullHand);
    const twoPairObj = twoPair(mapObj.suit, mapObj.value, fullHand);
    const fullHouseObj = fullHouse(mapObj.suit, mapObj.value, fullHand);
    const straightObj = straight(mapObj.suit, mapObj.value, fullHand);
    
    if (quadObj.hasQuad) {
        handRankObj.hasHands.push('four of a kind');
        handRankObj.highCards.push(quadObj.highCard);
    } else if (fullHouseObj.hasFullHouse) {
        handRankObj.hasHands.push('full house');
        handRankObj.highCards.push(fullHouseObj.highCard);
    } else if (flushObj.hasFlush) {
        handRankObj.hasHands.push('flush');
        handRankObj.highCards.push(flushObj.highCard);
    } else if (straightObj.hasStraight) {
        handRankObj.hasHands.push('straight');
        handRankObj.highCards.push(straightObj.highCard);
    } else if (tripObj.hasTrips) {
        handRankObj.hasHands.push('three of a kind');
        handRankObj.highCards.push(tripObj.highCard);
    } else if (twoPairObj.hasTwoPair) {
        handRankObj.hasHands.push('two pair');
        handRankObj.highCards.push(twoPairObj.highCard);
    } else if (pairObj.hasPair) {
        handRankObj.hasHands.push('pair');
        handRankObj.highCards.push(pairObj.highCard);
    } else {
        handRankObj.hasHands.push('high card');
        handRankObj.highCards.push(findHighCard(hand));
    }

    //if statements in order of rank so first thing in hashands is the best hand
    handRankObj.highestRankingHand = handRankObj.hasHands[0];
    handRankObj.highCardOfBestHand = handRankObj.highCards[0];
    // console.log(handRankObj.highestRankingHand)
    // console.log(handRankObj.highCardOfBestHand)
    return handRankObj;
}
//communityCards = ['s04', 'd04', 'c05', 'c02', 'dA'];
//determineHand(['h05','h04'])

//communityCards = ['s04', 'sA', 's09', 's02', 'dA'];
//determineHand(['s10','d03'])

function createMaps (hand) {
    // format [#2, #3, #4, #5, #6, #7, #8, #9, #10, #j, #q, #k, #a]
    const valueMap = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    // format [#clubs, #spaids, #hearts, #diamonds]
    const suitMap = [0,0,0,0];

    //deck in format of suit-value, exs: s03 cK hA
    hand.forEach(function(card){
        let cardSuit = card.slice(0, 1);
        let cardVal = card.slice(1);

        suitMap[suitMapDir[cardSuit]] += 1;
        
        if (cardVal === 'J' || cardVal === 'Q' || cardVal === 'K' || cardVal === 'A') {
            valueMap[valueMapDir[cardVal]] += 1;
        } else {
            valueMap[parseInt(cardVal)-2] += 1;
        }
    })

    const mapObj = {'value': valueMap, 'suit': suitMap}
    return mapObj;
}

function findHighCard (cards) {
    let highestCard;
    cards.forEach(function(card, idx) {
        let highestVal = 0;
        let cardSuit = card.slice(0, 1);
        let cardVal = card.slice(1);
        if (cardVal === 'A' || cardVal === 'K' || cardVal === 'Q' || cardVal === 'J') {
            cardVal = valueMapDir[cardVal] + 2;
        }
        if (idx === 0 || parseInt(cardVal) > parseInt(highestVal)) {
            highestCard = card;
            highestVal = parseInt(cardVal);
        }
    })
    return highestCard;
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
                
            });
        }
    });
    obj.highCard = findHighCard(flushCards);
    return obj;
}
//communityCards = ['s04', 'sA', 's09', 's02', 'dA'];
//determineHand(['s10','d03'])

function straight (suitMap, valueMap, fullHand) {
    let straightCards = [];
    let handHighCard;
    const obj = {
        'hasStraight': false,
        'hand': straightCards,
        'highCard': handHighCard
    }
    
    for (let i = 0; i<9; i++) {
        if (
            valueMap[i] > 0 &&
            valueMap[i+1] > 0 &&
            valueMap[i+2] > 0 &&
            valueMap[i+3] > 0 &&
            valueMap[i+4] > 0
        ) {
            obj.hasStraight = true;
            fullHand.forEach(function(card){
                let cardSuit = card.slice(0, 1);
                let cardVal = card.slice(1);
                if (cardVal === 'A' || cardVal === 'K' || cardVal === 'Q' || cardVal === 'J') {
                    cardVal = valueMapDir[cardVal] + 2;
                }
                if (parseInt(cardVal) >= i+2 && parseInt(cardVal) <= i+6) {
                    straightCards.push(card);
                }
            });
        }
        
    }
    obj.highCard = findHighCard(straightCards);
    return obj;
}


function fourKind (suitMap, valueMap, fullHand) {
    let quadCards = [];
    let handHighCard;
    const obj = {
        'hasQuad': false,
        'hand': quadCards,
        'highCard': handHighCard
    }

    valueMap.forEach(function(value, cardIdx){
        if (value === 4) {
            obj.hasQuad = true;
            fullHand.forEach(function(card){
                let cardSuit = card.slice(0, 1);
                let cardVal = card.slice(1);
                if (cardVal === 'A' || cardVal === 'K' || cardVal === 'Q' || cardVal === 'J') {
                    cardVal = valueMapDir[cardVal] + 2;
                }
                if(parseInt(cardVal) === cardIdx + 2) {
                    quadCards.push(card);
                }
            });
        }
    });
    obj.highCard = findHighCard(quadCards);
    return obj;
}

//communityCards = ['s04', 'd04', 'c04', 'c02', 'dA'];
//determineHand(['s10','h04'])
    // format [#2, #3, #4, #5, #6, #7, #8, #9, #10, #j, #q, #k, #a]

function fullHouse (suitMap, valueMap, fullHand) {
    let cloneFullHand = [...fullHand];
    let fullHouseCards = [];
    let handHighCard;
    const obj = {
        'hasFullHouse': false,
        'hand': fullHouseCards,
        'highCard': handHighCard
    }
    const firstHouseObj = threeKind(suitMap, valueMap, cloneFullHand);
    const newFullHand = [];
    cloneFullHand.forEach(function(card1, idx) {
        firstHouseObj.hand.forEach(function(card2) {
            if (card1 === card2) {
                cloneFullHand.splice(idx, 1);
            }
        })
    })
    const newMapObj = createMaps(cloneFullHand);
    const secondHouseObj = pair(newMapObj.suit, newMapObj.value, cloneFullHand);

    if (firstHouseObj.hasTrips && secondHouseObj.hasPair) {
        obj.hasFullHouse = true;
        fullHouseCards = firstHouseObj.hand.concat(secondHouseObj.hand);
    }

    console.log(fullHouseCards)

    obj.highCard = findHighCard(fullHouseCards);
    return obj;
}
//communityCards = ['s04', 'd04', 'c05', 'c02', 'dA'];
//determineHand(['h05','h04'])


function threeKind (suitMap, valueMap, fullHand) {
    let tripCards = [];
    let handHighCard;
    const obj = {
        'hasTrips': false,
        'hand': tripCards,
        'highCard': handHighCard
    }
    valueMap.forEach(function(value, cardIdx){
        if (value === 3) {
            obj.hasTrips = true;
            fullHand.forEach(function(card){
                let cardSuit = card.slice(0, 1);
                let cardVal = card.slice(1);
                if (cardVal === 'A' || cardVal === 'K' || cardVal === 'Q' || cardVal === 'J') {
                    cardVal = valueMapDir[cardVal] + 2;
                }
                if(parseInt(cardVal) === cardIdx + 2) {
                    tripCards.push(card);
                }
            });
        }
    });
    obj.highCard = findHighCard(tripCards);
    return obj;
}

function twoPair (suitMap, valueMap, fullHand) {
    let cloneFullHand = [...fullHand];
    let twoPairCards = [];
    let handHighCard;
    const obj = {
        'hasTwoPair': false,
        'hand': twoPairCards,
        'highCard': handHighCard
    }

    const firstPairObj = pair(suitMap, valueMap, cloneFullHand);
    const newFullHand = [];
    cloneFullHand.forEach(function(card1, idx) {
        firstPairObj.hand.forEach(function(card2) {
            if (card1 === card2) {
                cloneFullHand.splice(idx, 1);
            }
        })
    })
    const newMapObj = createMaps(cloneFullHand);
    const secondPairObj = pair(newMapObj.suit, newMapObj.value, cloneFullHand);

    if (firstPairObj.hasPair && secondPairObj.hasPair) {
        obj.hasTwoPair = true;
        twoPairCards = firstPairObj.hand.concat(secondPairObj.hand);
    }
    obj.highCard = findHighCard(twoPairCards);
    return obj;
}

//communityCards = ['s04', 'd05', 'c08', 'c04', 'dA'];
//determineHand(['s10','h05'])

function pair (suitMap, valueMap, fullHand) {
    let pairCards = [];
    let handHighCard;
    const obj = {
        'hasPair': false,
        'hand': pairCards,
        'highCard': handHighCard
    }
    valueMap.forEach(function(value, cardIdx){
        if (value === 2) {
            obj.hasPair = true;
            fullHand.forEach(function(card){
                let cardSuit = card.slice(0, 1);
                let cardVal = card.slice(1);
                if (cardVal === 'A' || cardVal === 'K' || cardVal === 'Q' || cardVal === 'J') {
                    cardVal = valueMapDir[cardVal] + 2;
                }
                if(parseInt(cardVal) === cardIdx + 2) {
                    pairCards.push(card);
                }
            });
        }
    });
    obj.highCard = findHighCard(pairCards);
    return obj;
}