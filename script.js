const playDeck = [
    ["h", 1], ["h", 2], ["h", 3], ["h", 4], ["h", 5], ["h", 6], ["h", 7], ["h", 8], ["h", 9], ["h", 10], ["h", 11], ["h", 12], ["h", 13],
    ["d", 1], ["d", 2], ["d", 3], ["d", 4], ["d", 5], ["d", 6], ["d", 7], ["d", 8], ["d", 9], ["d", 10], ["d", 11], ["d", 12], ["d", 13],
    ["c", 1], ["c", 2], ["c", 3], ["c", 4], ["c", 5], ["c", 6], ["c", 7], ["c", 8], ["c", 9], ["c", 10], ["c", 11], ["c", 12], ["c", 13],
    ["s", 1], ["s", 2], ["s", 3], ["s", 4], ["s", 5], ["s", 6], ["s", 7], ["s", 8], ["s", 9], ["s", 10], ["s", 11], ["s", 12], ["s", 13],
];
const discardDeck = [];
const dealerHand = [];
const playerHand = [];
const startB = document.getElementById("start");
const hit = document.getElementById("hit");
const stay = document.getElementById("stay");
const conc = document.getElementById("conclusion");
const playerCards = document.getElementById("playerCards");
const dealerCards = document.getElementById("dealerCards");


game();


function game() {
    startB.addEventListener("click", startButton);
    hit.addEventListener("click", hitButton);
    stay.addEventListener("click", stayButton);
    shuffle(playDeck);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function draw(hand, who) {
    //console.log("playDeck.length:" + playDeck.length);
    if (playDeck.length == 0) {
        resetDeck();
    }
    let currentCard = playDeck[playDeck.length - 1];
    playDeck.pop();
    hand.push(currentCard);
    if (who == 0) {
        //who == 0 is dealer
        if (hand.length == 1) {
            let newli = document.createElement('li');
            newli.id = "dealerFirstCard";
            newli.innerHTML = '<img src="cards/b.svg" alt="">';
            dealerCards.appendChild(newli);
        } else {
            let newli = document.createElement('li');
            newli.innerHTML = '<img src="cards/' + hand[hand.length - 1][0] + hand[hand.length - 1][1] + '.svg" alt="">';
            dealerCards.appendChild(newli);
        }
    } else {
        //who == 1 is player
        let newli = document.createElement('li');
        newli.innerHTML = '<img src="cards/' + hand[hand.length - 1][0] + hand[hand.length - 1][1] + '.svg" alt="">';
        playerCards.appendChild(newli);
    }

}

function checkHand(hand) {
    let score = 0;
    let aces = 0;
    hand.forEach(element => {
        if (element[1] == 1) {
            aces++;
        } else if (element[1] > 10) {
            score += 10;
        } else {
            score += element[1];
        }
    });

    if (aces == 1) {
        if (score + 11 <= 21) {
            score += 11;
        } else {
            score += 1;
        }
    } else if (aces > 1) {
        if (score + 11 + aces - 1 <= 21) {
            score = score + 11 + aces - 1;
        } else {
            score += aces;
        }
    }
    return score;
}

function setupGame() {
    dealerHand.length = 0;
    playerHand.length = 0;
    playerCards.innerHTML = "";
    dealerCards.innerHTML = "";
    draw(dealerHand, 0);
    draw(dealerHand, 0);
    draw(playerHand, 1);
    draw(playerHand, 1);
    displayScore(playerHand, 1);
    if (checkHand(playerHand) == 21) {
        blackjack();
    }
    displayScore(dealerHand, 2);
}

function blackjack() {
    conc.innerText = "Blackjack!";
    conc.style.color = "slateblue";
    hit.setAttribute("disabled", "");
}

function dealersTurn() {
    while (checkHand(dealerHand) < 17) {
        draw(dealerHand, 0);
    }
    flipFirstCard();
    displayScore(dealerHand, 0);
}

function startButton() {
    conc.innerText = "";
    hideButtons(1);
    setupGame();
}

function hitButton() {
    setTimeout(function () {
        console.log("Timeout more shit");
    }, 2000);
    draw(playerHand, 1);
    displayScore(playerHand, 1);
    if (checkHand(playerHand) == 21) {
        blackjack();
    }
    else if (checkHand(playerHand) > 21) {
        conclusion();
        hideButtons();
    }
}

function stayButton() {
    dealersTurn();
    conclusion();
    hideButtons();
    hit.removeAttribute("disabled", "");
}

function hideButtons(who) {
    if (who == 1) {
        startB.setAttribute("hidden", "");
        hit.removeAttribute("hidden", "");
        stay.removeAttribute("hidden", "");
    } else {
        startB.removeAttribute("hidden", "");
        hit.setAttribute("hidden", "");
        stay.setAttribute("hidden", "");
    }
}

function displayScore(hand, who) {
    if (who == 1) {
        //display players score
        let scoreText = document.getElementById("playerScore");
        scoreText.innerText = "You have " + checkHand(hand);
    } else if (who == 2) {
        //dealers score - face down card value
        let secondCard = hand[1][1];
        if (secondCard == 1) {
            secondCard = 11;
        } else if (secondCard > 10) {
            secondCard = 10;
        }
        let scoreText = document.getElementById("dealerScore");
        scoreText.innerText = "Dealer has ? + " + secondCard;

    } else {
        //display dealers score
        let scoreText = document.getElementById("dealerScore");
        scoreText.innerText = "Dealer has " + checkHand(hand);
    }
}

function conclusion() {
    let playerScore = checkHand(playerHand);
    let dealerScore = checkHand(dealerHand);
    if ((playerScore > dealerScore && playerScore < 22) || (playerScore < 22 && dealerScore > 21)) {
        //player wins
        conc.innerText = "You win!";
        conc.style.color = "green";
    } else if (playerScore == dealerScore) {
        //tied score
        conc.innerText = "It's a tie!";
        conc.style.color = "yellow";
    }
    else {
        //player loses
        conc.innerText = "You lose!";
        conc.style.color = "red";
    }
    discard(playerHand, dealerHand);
}

function discard(hand1, hand2) {
    hand1.forEach(function (element, index) {
        discardDeck.push(hand1[index]);
    });
    hand2.forEach(function (element, index) {
        discardDeck.push(hand2[index]);
    });
}

function resetDeck() {
    discardDeck.forEach(function (element) {
        playDeck.push(element);
    })
    discardDeck.length = 0;
    shuffle(playDeck);
}

function flipFirstCard() {
    let flipli = document.getElementById("dealerFirstCard");
    flipli.innerHTML = '<img src="cards/' + dealerHand[0][0] + dealerHand[0][1] + '.svg" alt="">';
}