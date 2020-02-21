var cards = [];
var cards2 = [];
var handsDealt = 0;

// eslint-disable-next-line no-unused-vars
function getPracticeCards() {
  function getRandomCardValues() { //for calculating the values of each card
    let currentValues = [Math.floor((Math.random()*13)+1),Math.floor((Math.random()*4)+1)];
    let numValue = currentValues[0]; //13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
    let numSuit = currentValues[1]; //4 card suit options excluding jokers. club,diamond,heart,spade
    currentValues.push(numValue+"-"+numSuit);
    return currentValues;
  }
  class Card {
    constructor(numValue, numSuit, identity) {
      this.numValue = numValue;
      this.numSuit = numSuit;
      this.identity = identity;
      this.imgSrc = "assets/images/cards/" + this.identity + ".png";
      this.isRoyal = isRoyal(this.numValue);
      this.isJackOrBetter = isJackOrBetter(this.numValue);
      this.isHeld = false;
      function isRoyal(value) {
        if (value == 1 || value == 10 || value == 11 || value == 12 || value == 13) {
          return true;
        }
        else {
          return false;
        }
      }
      function isJackOrBetter(value) {
        if (value == 1 || value == 11 || value == 12 || value == 13) {
          return true;
        }
        else {
          return false;
        }
      }
    }
  }
  function createCardElement(imgUrl, currentCard){
    let cardImage = document.createElement("img");
    cardImage.className ="cards img-fluid";
    cardImage.src = imgUrl;
    cardImage.setAttribute("id", "card"+currentCard);
    document.getElementsByClassName('card-slot-div')[currentCard].appendChild(cardImage);
    return cardImage;
  }
  var currentHand = 0;
  document.getElementById("card-deal-button").setAttribute('disabled', 'disabled');
  document.getElementById("hand-ranking-heading").style.display = "none";
    var cardImages = document.getElementsByClassName("cards");
    while(cardImages.length > 0){
        cardImages[0].parentNode.removeChild(cardImages[0]);
    }
  if (handsDealt >= 3)
  {
    handsDealt = 0;
  }
  for (let currentCard=0; currentCard<5; currentCard++){
    let currentValues = 0;
    if (handsDealt===0)
    {
      currentHand = cards;
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      let isSameIdentity=true;
      while (isSameIdentity===true)
        {
          if (currentCard === 0)
          {
            isSameIdentity=false;
          }
          currentValues = getRandomCardValues();
          if (cards.filter(x => (x.identity === currentValues[2])).length === 0){
            isSameIdentity=false;
          }
        }
    cards.push(new Card(currentValues[0],currentValues[1],currentValues[2]));
    let cardImage = createCardElement(cards[currentCard].imgSrc, currentCard);
    cardImage.addEventListener("click", function(){toggleCardHold("hold"+currentCard);});
    document.getElementById("hand-odds-div").style.display = "none";
    document.getElementById("show-hide-odds-button").style.display = "none";
    }
    else if (handsDealt==1)
    {
      currentHand = cards2;
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      let isSameIdentity=true;
      while (isSameIdentity===true)
      {
        currentValues = getRandomCardValues();
        if (cards.filter(x => (x.identity === currentValues[2])).length === 0){
          if (currentCard === 0)
          {
            isSameIdentity=false;
          }
          else if (cards2.filter(y => (y.identity === currentValues[2])).length === 0){
            isSameIdentity=false;
          }
        }
      }
      if (cards[currentCard].isHeld===true)
      {
        cards2.push(new Card(cards[currentCard].numValue,cards[currentCard].numSuit,cards[currentCard].identity));
      }
      else {
        cards2.push(new Card(currentValues[0],currentValues[1],currentValues[2]));
      }
        createCardElement(cards2[currentCard].imgSrc, currentCard);
        document.getElementById("card-deal-button").innerText = "Play Again";
        if (currentCard == 4) {
          cards = [];
          cards2 = [];
          document.getElementById("hand-ranking-heading").style.display = "block";
          // document.getElementById("hand-odds-div").style.display = "none";
        }
    }
    else
    {
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      createCardElement("assets/images/cards/card_standard_blue_back.png", currentCard);
      document.getElementById("card-deal-button").innerText = "Deal Cards";
      document.getElementById("card-deal-button").removeAttribute("disabled");
      let showHideOddsButton = document.getElementById("show-hide-odds-button");
      if (showHideOddsButton.innerText == "Hide Odds") {
        document.getElementById("hand-odds-div").style.display = "block";
      }
      showHideOddsButton.style.display = "inline-block";
    }
  }
  if (handsDealt<2)
  {
    let resultText = "Game Over";
    resultText = getHandRanking(currentHand);
    if (resultText!="Game Over" && handsDealt==1) {
      winHandDialog(resultText);
    }
    document.getElementById("hand-ranking-heading").innerText = resultText;
    if (resultText=="Game Over")
    {
      document.getElementById("hand-ranking-heading").style.color = "crimson"; // if no hand category has been acheived, red text
    }
    else
    {
    document.getElementById("hand-ranking-heading").style.display = "block";
    document.getElementById("hand-ranking-heading").style.color = "darkblue"; // if a hand category has been acheived, blue text
    }
    // if (handsDealt==0){
    //   if (resultText=="Royal Flush"){
    //     document.getElementById("royal-flush-odds").innerText = "100";
    //   }
    //   else {
    //     getHandOdds();
    //   }
    // }
    // else {
    //   document.getElementById("royal-flush-odds").innerText = "0.000154";
    // }
  }
  handsDealt++;
  document.getElementById("card-deal-button").removeAttribute("disabled");
}

function getHandRanking(hand) {
  let highestSameKindCount = classifySameKinds(hand);
  let isFlush = isFlushHand(hand);
  let isRoyal = isRoyalHand(hand);
  let isStraight = isStraightHand(hand[0].numValue, hand[1].numValue, hand[2].numValue, hand[3].numValue, hand[4].numValue);
  let result = "Game Over";
  if (isTwoPairHand(hand) === true) {
    result = "Two Pair";
  }
  else if (isJackOrBetterHand(hand) === true && highestSameKindCount == 2) {
    result = "Jacks or Better";
  }
  else if (highestSameKindCount == 3) {
    if (pairExists(hand) === true) {
      result = "Full House";
    }
    else {
      result = "3 of a Kind";
    }
  }
  else if (isStraight === true && isFlush === false) { //normal straight, not a royal straight/flush
    result = "Straight";
  }
  else if (highestSameKindCount == 4) {
    result = "4 of a Kind";
  }
  else if (isFlush === true) { //determine if flush (royal, straight, normal)
      if (isRoyal === true) //determine if royal flush
      {
        result = "Royal Flush";
      }
      else if (isStraight === true) { //determine if straight flush, not royal. Need each card to be 1 apart //working
        result = "Straight Flush";
      }
      else { //hand is a normal flush
        result = "Flush";
      }
    }
  return result;
  function isFlushHand(hand){
    if (hand[0].numSuit==hand[1].numSuit && hand[1].numSuit==hand[2].numSuit
    && hand[2].numSuit==hand[3].numSuit && hand[3].numSuit==hand[4].numSuit)
    {
      return true;
    }
    return false;
  }
  function isStraightHand(v0,v1,v2,v3,v4){
    let compArray = [v0,v1,v2,v3,v4];
    let minNum = Math.min(v0,v1,v2,v3,v4);
    if (compArray.includes(minNum+1) && compArray.includes(minNum+2) && compArray.includes(minNum+3) && compArray.includes(minNum+4))
    {
      return true;
    }
    else if (compArray.includes(10) && compArray.includes(11) && compArray.includes(12) && compArray.includes(13) && compArray.includes(1)){
      return true;
    }
    return false;
  }
  function isRoyalHand(hand){
    if (hand[0].isRoyal==true && hand[1].isRoyal==true &&
       hand[2].isRoyal==true && hand[3].isRoyal==true && hand[4].isRoyal==true)
    {
      return true;
    }
    return false;
  }
  function classifySameKinds(hand){
    for (let i=0;i<5;i++){
    let currentKindCount = 1;
      for (let j=4;j>=0;j--){
       if (hand[i] != hand[j]){
          if (hand[i].numValue == hand[j].numValue){
            currentKindCount++;
          }
        }
      }
     hand[i].sameKindCount = currentKindCount;
     if (currentKindCount==2){
       hand[i].hasPair = true;
       if (hand[i].isJackOrBetter==true){
         hand[i].isJackOrBetterPair = true;
       }
       else {
         hand[i].isJackOrBetterPair = false;
       }
     }
     else {
       hand[i].hasPair = false;
     }
    }
    return Math.max(hand[0].sameKindCount,hand[1].sameKindCount,hand[2].sameKindCount,hand[3].sameKindCount,hand[4].sameKindCount);
  }
  function pairExists(hand){
    for (let i=0;i<5;i++){
      if (hand[i].hasPair == true){
        return true;
      }
    }
    return false;
  }
  function isTwoPairHand(hand){
    let numPairs = 0;
    for (let i=0;i<5;i++){
      if (hand[i].hasPair == true){
        numPairs++;
      }
    }
    if (numPairs==4)
    {
      return true;
    }
    return false;
  }
  function isJackOrBetterHand(hand){
    for (let i=0;i<5;i++){
      if (hand[i].isJackOrBetterPair == true){
        return true;
      }
    }
    return false;
  }
}

// eslint-disable-next-line no-unused-vars
function getHandOdds(){
  // let royalFlushOdds = getRoyalFlushOdds();
  // alert("Royal Flush Odds ran");
  // document.getElementById("royal-flush-odds").innerText = royalFlushOdds;
  // function getRoyalFlushOdds(){
  //   let remainingRoyalFlushCombos = 4;
  //   let clubRoyalFlushRemains = 1,diamondRoyalFlushRemains = 1,heartRoyalFlushRemains = 1,spadeRoyalFlushRemains = 1;
  //   let royalClubsRemaining = 5,royalDiamondsRemaining = 5,royalHeartsRemaining = 5,royalSpadesRemaining = 5;
  //   let cardsHeld = 0;
  //   for (let currentCard = 0; currentCard < 5; currentCard++){
  //     if (cards[currentCard].isRoyal === false && cards[currentCard].isHeld === true) {
  //       return 0;
  //     }
  //     else if (cards[currentCard].isRoyal === true && cards[currentCard].isHeld === false){
  //       if (cards[currentCard].numSuit == 1){
  //         clubRoyalFlushRemains = 0;
  //       }
  //       else if (cards[currentCard].numSuit == 2){
  //         diamondRoyalFlushRemains = 0;
  //       }
  //       else if (cards[currentCard].numSuit == 3){
  //         heartRoyalFlushRemains = 0;
  //       }
  //       else {
  //         spadeRoyalFlushRemains = 0;
  //       }
  //       remainingRoyalFlushCombos=clubRoyalFlushRemains+diamondRoyalFlushRemains+heartRoyalFlushRemains+spadeRoyalFlushRemains;
  //     }
  //     else if (cards[currentCard].isRoyal === true && cards[currentCard].isHeld === true) {
  //       if (cards[currentCard].numSuit == 1){
  //         royalClubsRemaining--;
  //         if (royalDiamondsRemaining <= royalClubsRemaining || royalHeartsRemaining <= royalClubsRemaining || royalSpadesRemaining <= royalClubsRemaining){
  //           return 0;
  //         }
  //         cardsHeld++;
  //       }
  //       else if (cards[currentCard].numSuit == 2){
  //         royalDiamondsRemaining--;
  //         if (royalClubsRemaining <= royalDiamondsRemaining || royalHeartsRemaining <= royalDiamondsRemaining || royalSpadesRemaining <= royalDiamondsRemaining){
  //           return 0;
  //         }
  //         cardsHeld++;
  //       }
  //       else if (cards[currentCard].numSuit == 3){
  //         royalHeartsRemaining--;
  //         if (royalDiamondsRemaining <= royalHeartsRemaining || royalClubsRemaining <= royalHeartsRemaining || royalSpadesRemaining <= royalHeartsRemaining){
  //           return 0;
  //         }
  //         cardsHeld++;
  //       }
  //       else {
  //         royalSpadesRemaining--;
  //         if (royalDiamondsRemaining <= royalSpadesRemaining || royalHeartsRemaining <= royalSpadesRemaining || royalClubsRemaining <= royalSpadesRemaining){
  //           return 0;
  //         }
  //         cardsHeld++;
  //       }
  //     }
  //   }
  //   let closestRoyalFlush = Math.min(royalClubsRemaining,royalDiamondsRemaining,royalHeartsRemaining,royalSpadesRemaining);
  //   let num = 1/((2598960/remainingRoyalFlushCombos)/cardsHeld)*100;
  //   if (cardsHeld===0){
  //     num = 1/((2598960/remainingRoyalFlushCombos)-(49980*5))*100;
  //   }
  //   if (num === 0){
  //     return 0;
  //   }
  //   return num.toFixed(6);
  // }
  return;
}

function toggleCardHold(currentHoldElement) {
  if (handsDealt == 1)
  {
    let holdElement = document.getElementById(currentHoldElement);
    holdElement.style.opacity != 1 ? holdElement.style.opacity = 1 : holdElement.style.opacity = 0.0001;
    let cardNum = parseInt(currentHoldElement.replace(/hold/,""));
    cards[cardNum].isHeld !== true ? cards[cardNum].isHeld = true : cards[cardNum].isHeld = false;
    }
  else {
    return;
  }
}

// eslint-disable-next-line no-unused-vars
function toggleOddsTable(){
  let oddsDiv = document.getElementById("hand-odds-div");
  let showHideOdds = document.getElementById("show-hide-odds-button");
  if (oddsDiv.style.display == "none"){
      oddsDiv.style.display = "block";
      showHideOdds.innerText = "Hide Odds";
  }
  else {
      oddsDiv.style.display = "none";
      showHideOdds.innerText = "Show Odds";
  }
}

function winHandDialog(result) {
  let winDialog = document.getElementById('winHandDialog');
  if (typeof winDialog.showModal === "function") {
    document.getElementById('hand-win-popup-span').innerText = result;
    winDialog.showModal();
    setTimeout(function() { winDialog.close() }, 2000);
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
  document.getElementById('winHandCancel').onclick = function() {
    winDialog.close();
  }
}
