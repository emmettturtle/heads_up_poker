/*----- constants -----*/
//deck in format of suit-value, exs: s03 cK hA
const deck = buildDeck();

/*----- state variables -----*/


/*----- cached elements  -----*/


/*----- event listeners -----*/


/*----- functions -----*/

function buildDeck() {
    const suits = ['s', 'c', 'd', 'h'];
    const values = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    suits.forEach(function(suit){
        values.forEach(function(value){
            deck.push(suit+value);
        });
    });

    return deck;
}