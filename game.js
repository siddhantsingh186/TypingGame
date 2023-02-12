const quotes = [];
async function getQuotes(){
    const response = await fetch('https://type.fit/api/quotes');
    const data = await response.json();
    const selectedQuotes = data.slice(0,15);
    selectedQuotes.forEach(quote => {
        quotes.push(quote.text);
    });
    console.log(quotes);
}

getQuotes()

let currentQuoteIndex = 0;
let totalScore = 0;
let startTime = null;
let completionTimes = [];

const quoteDisplayElement = document.getElementById('quote');
const inputElement = document.getElementById('input');
const scoreboardElement = document.getElementById('scoreboard');
const leaderboardElement = document.getElementById('leaderboard');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');

function showNextQuote(){
    if(currentQuoteIndex >= quotes.length){
        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;
        const scoreString = `Score: ${totalScore} | Time: ${totalTime.toFixed(2)} seconds`;
        scoreboardElement.textContent = scoreString;
        localStorage.setItem('score', totalScore);
        localStorage.setItem('time', totalTime);
        showLeaderboard();
        return;
    }
    const quote = quotes[currentQuoteIndex];
    quoteDisplayElement.textContent = quote;
    inputElement.value = "";
    inputElement.focus();
}

function checkInput(){
    const currentQuote = quotes[currentQuoteIndex];
    const input = inputElement.value;
    if(input === currentQuote){
        totalScore += 1;
    }
    currentQuoteIndex++;
    showNextQuote();
}

inputElement.addEventListener('keyup', function(event){
    if(event.key === 'Enter'){
        checkInput();
    }
});

startButton.addEventListener('click', function(event){
    gameContainer.removeChild(startButton);
    inputElement.removeAttribute('hidden');
    startGame();
});

function startGame(){
    currentQuoteIndex = 0;
    totalScore = 0;
    startTime = Date.now();
    completionTimes = [];
    showNextQuote();

    const timerInterval = setInterval(function() {
        const elapsedTime = (Date.now() - startTime) / 1000;
        scoreboardElement.textContent = `Score: ${totalScore} | Time: ${elapsedTime.toFixed(2)}`;
        if (currentQuoteIndex >= quotes.length) {
          clearInterval(timerInterval);
        }
    }, 100);
}

function showLeaderboard(){
    document.getElementById('instruction').textContent = "";
    document.querySelector('h1').textContent = "Leaderboard";
    quoteDisplayElement.hidden = true;
    inputElement.hidden = true;
    leaderboardElement.innerHTML = "";
    let scores = localStorage.getItem('scores')? JSON.parse(localStorage.getItem('scores')) : [];
    localStorage.getItem('score')? scores.push({score: localStorage.getItem('score'), time: localStorage.getItem('time')}) : null;

    scores.sort(function(a,b){
        if(a.score !== b.score){
            return b.score - a.score;
        }
        else{
            return a.time - b.time;
        }
    });
    localStorage.setItem('scores', JSON.stringify(scores));
    console.log(scores);
    const scoreList = document.createElement('ol');

    for(let i=0;i<scores.length;i++){
        const scoreItem = document.createElement('li');
        scoreItem.textContent = `${scores[i].score} | ${scores[i].time} seconds`;
        scoreList.appendChild(scoreItem);
    }

    leaderboardElement.appendChild(scoreList);

}
