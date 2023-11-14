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
let handWinner; //null, 1 (player), -1 (Emmett)
let gameWinner; //null, 1 (player), -1 (Emmett)
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

function buildDeck() {
    const deck = [];

    suits.forEach(function(suit){
        values.forEach(function(value){
            deck.push(suit+value);
        });
    });

    return deck;
}