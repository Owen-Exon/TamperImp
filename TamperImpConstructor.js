// ==UserScript==
// @name     TamperImp
// @namespace  https://raw.githubusercontent.com/Owen-Exon/TamperImp/refs/heads/main/TamperImp.js
// @version    0.0.8
// @description  Various changes to UI and interactions
// @match    *://clocktower.live/*
// @grant    none
// ==/UserScript==

(function () {
  const data_LHF_Unlovable = getDataUri("./media/LHF_Unlovable.ttf")
  
  const data_nomineeHand = getDataUri("./media/clock-nominee.webp")
  const data_nominatorHand = getDataUri("./media/clock-vote.webp")
  
  const data_TokenImage = getDataUri("./media/token.webp")
  const data_Reminder = getDataUri("./media/reminder.webp")
  const data_lifeToken = getDataUri("./media/life.webp")
  const data_TravelerLifeToken = getDataUri("./media/travelerLife.webp")
  const data_deathToken = getDataUri("./media/death.webp")
  const data_voteToken = getDataUri("./media/vote.webp")
  const data_shroud = getDataUri("./media/shroud.webp")
  
  const data_townsfolk = getDataUri("./media/townsfolk.webp")
  const data_outsider = getDataUri("./media/outsider.webp")
  const data_minion = getDataUri("./media/minion.webp")
  const data_demon = getDataUri("./media/demon.webp")
  const data_traveler = getDataUri("./media/traveler.webp")
  
  const data_binSVG = getDataUri("./media/bin.svg")
  
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: "LHF_Unlovable";
      src: url("${data_LHF_Unlovable}") format("truetype");
      font-display: swap;
    }
    .token {
      background-image: url("${data_TokenImage}") !important;
    }
    ul.tokens li:not(.count) {
      min-width: 120px !important;
    }
    ul.tokens .count {
      min-width: 50px !important;
    }
    #vote {
      background: unset !important;
    }
    #vote .overlay {
      padding: 10px !important;
      background: rgba(0, 0, 0, 0.5) !important;
      border-radius: 10px !important;
      border: 3px solid black !important;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5)) !important;
    }
    .nominee::before {
      background-image: url("${data_nomineeHand}") !important;
    }
    .nominator::before {
      background-image: url("${data_nominatorHand}") !important;
    }
    .roles .modal {
      max-width: 80% !important;
    }
    .info .edition {
      display:none !important;
    }
    .info li {
      font-weight: 700;
      width: 100%;
      filter: drop-shadow(0 0 2px rgba(0, 0, 0, .7));
      display: flex;
      flex-wrap: nowrap !important;
      justify-content: center;
      text-shadow: 0 2px 1px #000, 0 -2px 1px #000, 2px 0 1px #000, -2px 0 1px #000;
    }
    .votes *,
    .has-vote *,
    .players:not(.tabs) *, 
    .meta,
    .alive,
    .reminder.add .icon {
      display:none !important;
    }
    .info li:not(.edition-title-author) span:not(.meta):not(:has(.fa-cloud-moon)) {
      display:flex !important;
      align-items:center;
      height:1.75em;
    }
    .edition-title-author {
      text-align:center;
      flex-direction: column;
    }
    .edition-title {
      margin-left: 10px;
      margin-right: 10px;
      text-align: center !important;
      flex-basis: 100% !important;
      font-family: LHF_Unlovable, sans-serif !important;
      font-weight: normal !important;
      font-size:min(6vh,6vw) !important;
      letter-spacing: 0mm !important;
      word-spacing:-3mm !important;
      margin-bottom:-0.2em !important;
      white-space: nowrap !important;
    }
    .edition-author {
      font-size:min(2.3vh,2.3vw) !important;
      font-family:papyrus !important;
    }
    .player .life {
      background-image: url("${data_lifeToken}") !important;
    }
    .player.traveller .life {
      background-image: url("${data_TravelerLifeToken}") !important;
      filter:unset !important;
    }
    .player.dead .life {
      background-image: url("${data_deathToken}") !important;
    }
    .player.dead .life:after {
      background-image: url("${data_voteToken}") !important;
      background-size: 70% !important;
    }
    .info {
      padding: 5px !important;
      background: rgba(0, 0, 0, 0.5) !important;
      border-radius: 10px !important;
      border: 3px solid black !important;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5)) !important;
      height: unset !important;
      width: min-content !important;
    }
    .info > li > span:has(.players)::after,
    .info > li > span:has(.townsfolk)::after,
    .info > li > span:has(.outsider)::after,
    .info > li > span:has(.minion)::after,
    .info > li:has(.traveller) > span:has(.demon)::after {
      content: "|" !important;
      color: #fff5 !important;
      margin: 0 5px 0 1px !important;
      font-weight:100 !important;
    }
    .info > li > span:has(.fa-cloud-moon) {
      display:none !important;
    }
    .player .shroud::before {
      background: url("${data_shroud}") center center no-repeat !important;
      background-size: auto 100% !important;
    }
    .votes {
      background-image: url("${data_voteToken}"), url("${data_deathToken}") !important;
      background-position: center center,center center !important;
      background-repeat: no-repeat,no-repeat !important;
      background-size: 70%,contain !important;
      width: 1.5em !important;
      height: 1.5em !important;
      margin:3px !important;
    }
    .has-vote {
      background: url("${data_voteToken}") center center no-repeat !important;
      background-size: contain !important;
      width: 1.5em !important;
      height: 1.5em !important;
    }
    .has-vote {
      margin-top: -25% !important;
      right: -3% !important;
      cursor:pointer !important;
    }
    span:has(> .alive) {
      order: -1 !important
    }
    span:has(> .players:not(.tabs))::before {
      content : "/";
      margin: 3px
    }
    .circle .reminder,
    ul.reminders .reminder {
      background-image: url("${data_Reminder}") !important;
    }
    .reminder .text {
      color: #fff !important;
      text-shadow: 0 1px 1px #000, 0 -1px 1px #000, 1px 0 1px #000, -1px 0 1px #000 !important;
      font-weight: unset !important;
      font-size: 60% !important;
      
    }
    .circle .reminder:not(.custom) .text {
      margin-top: 45% !important;
    }
    .reminder .icon {
      width:80% !important
    }
    ul.reminders .reminder .text {
      font-size: 75% !important;
    }
    .circle .reminder:after {
      background-image: url("${data_binSVG}");
      width:50% !important;
    }
    .players:not(.tabs) {
      background: url("${data_lifeToken}") center center no-repeat !important;
    }
    .players:not(.tabs),
    svg.demon.svg-inline--fa,
    svg.minion.svg-inline--fa,
    svg.outsider.svg-inline--fa,
    svg.townsfolk.svg-inline--fa,
    svg.traveller.svg-inline--fa {
      background-size: contain !important;
      width: 1.5em !important;
      height: 1.5em !important;
      background-position:center center !important;
      background-repeat:no-repeat !important;
      margin:3px !important;
    }
    svg.demon.svg-inline--fa {background-image: url("${data_demon}") !important;}
    svg.minion.svg-inline--fa {background-image: url("${data_minion}") !important;}
    svg.outsider.svg-inline--fa {background-image: url("${data_outsider}") !important;}
    svg.townsfolk.svg-inline--fa {background-image: url("${data_townsfolk}") !important;}
    svg.traveller.svg-inline--fa {background-image: url("${data_traveler}") !important;}
    
    svg.demon.svg-inline--fa *,
    svg.minion.svg-inline--fa *,
    svg.outsider.svg-inline--fa *,
    svg.townsfolk.svg-inline--fa *,
    svg.traveller.svg-inline--fa * {
      display: none !important;
    }
    ul li .icon[data-v-2c5ce81f] {
      width: 64px !important;
      height: 64px !important;
      background-size: cover !important;
      background-position: unset !important;
      flex: 0 0 64px !important;
    }
  `
  document.head.appendChild(style);

  let updateScheduled = false;

  function updateEdition() {
    const info = document.querySelector('.info');
    const edition = info?.querySelector('.edition');

    if (!info || !edition) {return;}

    let Title = '';
    let Author = '';

    if (edition.classList.contains('edition-tb')) {Title = 'Trouble Brewing'; Author = 'The Pandemonium Institute';}
    else if (edition.classList.contains('edition-bmr')) {Title = 'Bad Moon Rising'; Author = 'The Pandemonium Institute';}
    else if (edition.classList.contains('edition-snv')) {Title = 'Sects & Violets'; Author = 'The Pandemonium Institute';}
    else {
      const meta = info.querySelector('.meta');

      if (meta) {
        const text = meta.textContent.trim();
        const parts = text.split(/\s+by\s+/i);

        Title = parts[0]?.trim() || '';
        Author = parts[1]?.trim() || '';
      }
    }

    let li = info.querySelector('.edition-title-author');

    if (!li) {
      li = document.createElement('li');
      li.className = 'edition-title-author';

      li.innerHTML = `
        <span class="edition-title"></span>
        <span class="edition-author"></span>
      `;

      edition.insertAdjacentElement('afterend', li);
    }

    const titleSpan = li.querySelector('.edition-title');
    const authorSpan = li.querySelector('.edition-author');

    const newTitle = Title;
    const newAuthor = Author ? 'by ' + Author : '';

    if (titleSpan.textContent !== newTitle) {titleSpan.textContent = newTitle;}
    if (authorSpan.textContent !== newAuthor) {authorSpan.textContent = newAuthor;}
    if (edition.nextElementSibling !== li) {edition.insertAdjacentElement('afterend', li);}
  }

  function updateDisplay() {
    updateScheduled = false;

    updateEdition()
  }


  function scheduleUpdate() {
    if (updateScheduled) {return;}
    updateScheduled = true;
    requestAnimationFrame(updateDisplay);
  }

  const observer = new MutationObserver(() => {scheduleUpdate();});

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class']
  });

  scheduleUpdate();
})();