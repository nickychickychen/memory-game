(function(){
  "use strict";
  //global constants
  const cluePauseTime = 333; //time to pause between clues
  const nextClueWaitTime = 1000; //time to wait before playing sequence

  //Global variables
  var pattern = []; //TODO: make this a random pattern
  var progress = 0;
  var gamePlaying = false;
  var tonePlaying = false;
  var volume = 0.5;
  var guessCounter = 0;
  var clueHoldTime = 1000; //time to hold each clue's light+sound

  function init() {
    id("startBtn").addEventListener("click", startGame);
    id("stopBtn").addEventListener("click", stopGame);

    id("button1").addEventListener("click", function(){guess(1)});
    id("button1").addEventListener("mousedown", function(){startTone(1)});
    id("button1").addEventListener("mouseup", stopTone);

    id("button2").addEventListener("click", function(){guess(2)});
    id("button2").addEventListener("mousedown", function(){startTone(2)});
    id("button2").addEventListener("mouseup", stopTone);
    
    id("button3").addEventListener("click", function(){guess(3)});
    id("button3").addEventListener("mousedown", function(){startTone(3)});
    id("button3").addEventListener("mouseup", stopTone);
    
    id("button4").addEventListener("click", function(){guess(4)});
    id("button4").addEventListener("mousedown", function(){startTone(4)});
    id("button4").addEventListener("mouseup", stopTone);
  }

  function startGame(){ 
    //initialize game variables
    randomPattern(10); //todo: call this in the difficulty method later
    progress = 0;
    gamePlaying = true;
    
    //swap start and stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    
    playClueSequence();
  }

  function stopGame(){
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
  }

  // Page Initialization
  // Init Sound Synthesizer
  var AudioContext = window.AudioContext || window.webkitAudioContext 
  var context = new AudioContext()
  var o = context.createOscillator()
  var g = context.createGain()
  g.connect(context.destination)
  g.gain.setValueAtTime(0,context.currentTime)
  o.connect(g)
  o.start(0)

  // Sound Synthesis Functions
  const freqMap = { //pitch of the sounds 
    1: 261.6,
    2: 329.6,
    3: 392,
    4: 480
  }
  
  function playTone(btn,len){ 
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function(){
      stopTone()
    },len)
  }

  function startTone(btn){
    if(!tonePlaying){
      context.resume()
      o.frequency.value = freqMap[btn]
      g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
      context.resume()
      tonePlaying = true
    }
  }

  function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
  }

  function lightButton(btn){
    document.getElementById("button" + btn).classList.add("lit")
  }

  function clearButton(btn){
    document.getElementById("button" + btn).classList.remove("lit")
  }

  function playSingleClue(btn){
    if(gamePlaying){
      lightButton(btn);
      playTone(btn,clueHoldTime);
      setTimeout(clearButton,clueHoldTime,btn);
    }
  }

  function playClueSequence(){
    guessCounter = 0;
    let delay = nextClueWaitTime; //set delay to init wait time
    for(let i = 0; i<= progress; i++){ //for each clue revealed so far
      console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
      setTimeout(playSingleClue, delay, pattern[i]) //set timeout to play the clue
      delay += clueHoldTime
      delay += cluePauseTime;
    }
    clueHoldTime -= 75; //makes the clues go faster each round
  }

  function loseGame(){
    stopGame();
    alert("Game Over. You Lost.")
  }

  function winGame(){
    stopGame();
    alert("Game Over. You Won!")
  }

  function guess(btn){
    console.log("user guessed: " + btn);
    
    if(!gamePlaying){
      return;
    }
    
    if(pattern[guessCounter] == btn){
      //Guess was correct!
      if(guessCounter == progress){
        if(progress == pattern.length - 1){
          //GAME OVER: WIN!
          winGame();
        }
        else{
          //Pattern correct. Add next segment
          progress++;
          playClueSequence();
        }
      }
      else{
        //so far so good... check the next guess
        guessCounter++;
      }
    }
    else{
      //Guess was incorrect
      //GAME OVER: LOSE!
      loseGame();
    }
  }

  function randomPattern(len){ //TODO: make this 2 params //len = length of pattern; tiles = # of tiles for pattern
    pattern = [];
    for(let i = 0; i<len; i++){
      pattern.push(Math.ceil(Math.random() * 4)); 
    }
  }

  init(); //calls init function
})();
 