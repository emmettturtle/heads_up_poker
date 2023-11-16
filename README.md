# Heads Up Poker: Beat Emmett!


## Overview
This project is a full browser game where you are playing heads up (1v1), texas hold em' poker, against a bot to represent me. In this first itteration of the game I have built out a full user interface and game mechanics including, basic gameplay flow, rendering, hand determination/win logic, and a basic bot that I have given my name because it is my child. In this current itteration of the game the bot is mostly making structured random decsisions (accurate to how I go through life). If you have experience in playing poker you would know that this can actually make the game more difficult because it is harder to predict what hand an oppenent has if their actions are irrational. This is why experienced poker players can sometimes not do well against new players. All this to say, dont underestimate the stupid Emmett bot!!


## Game Walkthrough
Below are screenshots of the game walking through a basic hand of poker.


![Imgur](https://i.imgur.com/vpIxOmf.png)
First off you have your opening round. Current bets and the pot are zero and each player starts with 200 in the bank. You have 2 cards dealt to you and 2 cards are dealt to Emmett but they are hidden. And all 5 community cards are also hidden.

![Imgur](https://i.imgur.com/Ty4ODog.png)
After both players bet 15 on the initial round (making the pot 30 and removing 15 from each bank), the game goes into round 2 and reveals the first 3 community cards. Player places another bet of 10 and waits for Emmett's response.

![Imgur](https://i.imgur.com/VtIZoSr.png)
Emmett raises and indicated by the message in the bottom right hand corner. Player calls and we move to round 3. 

![Imgur](https://i.imgur.com/RC5d8AA.png)
After not much excitement in round 3 (not shown) we find ourselves in the final round. All 5 community cards are now shown and after final bets are placed Emmett's hand is shown to reveal the best of 2 bad hands, ace high. Not so stupid afterall! Emmett wins, as indicated by the message, and the money from the pot is added to Emmett's bank. 

![Imgur](https://i.imgur.com/wP83Ly5.png)
The next round is automatically activated after a few seconds. The deck is shuffled, cards are redealt, the pot is cleared, and banks are updated. This will all repeat until someone is out of money and a game winner will be declared.


#### Technologies Used
> This project used html, css, and javaScript.
>
> A library of card images was also used and embeded within the file structure. 

## Getting Started
To play the game go [here](https://emmettturtle.github.io/heads_up_poker/).

Things to know:
- For starters, if you aren't already, you will want to familiarize yourself with the rules of poker. 
- Once you are ready to play use the button interface to enter what you would like to do.
- Pay attention to the message in the bottom right hand corner! It will give you helpful info on what's happening in the game.
- The game will revolve through rounds and hands on its own so just be patient. But if you would like to play a new game press the new game button and everything should reset. 
- It is likely that there are still some bugs so if you run into any and are feeling helpful please reach out with the problem you ran into. 


## What's next?
This is only the first itteration of this game. As I learn more I plan on coming back to it and updating the game to be better. Ironing out bugs and making the UI look and feel better will be a priority but mostly I want to make the Emmett bot really good. This will definetly be a challenge and at some point I would want to implement some machine learning to truly make Emmett unbeatable! As my skills improve so will Emmett's :)