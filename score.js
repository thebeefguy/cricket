document.addEventListener("DOMContentLoaded", () => {
    const setupForm = document.getElementById("setupForm");
    if (setupForm) setupForm.addEventListener("submit", handleSetup);

    const scoreDisplay = document.getElementById("scoreDisplay");
    if (scoreDisplay) updateLiveDisplay();

    const battingScorecard = document.getElementById("battingScorecard");
    const bowlingScorecard = document.getElementById("bowlingScorecard");
    if (battingScorecard && bowlingScorecard) updateScorecard();
    if ( document.getElementById("matchResult") ) {
        console.log("summary!")
        displayResult();
    }
});

function handleSetup(e) {
    e.preventDefault();

    const team1Name   = document.getElementById("team1").value.trim();
    const team2Name   = document.getElementById("team2").value.trim();
    const tossWinner  = document.getElementById("tossWinner").value;
    const tossDecision= document.getElementById("tossDecision").value;

    const createTeam = name => ({
        name,
        score: { runs: 0, wickets: 0, balls: 0 },
        players: {
            onField: [],
            out: []
        },
        bowlers: []
    });

    const team1 = createTeam(team1Name);
    const team2 = createTeam(team2Name);

    const matchDetails = {
        teams: [ team1, team2 ],
        battingIndex:
        tossWinner === "team1"
        ? (tossDecision === "bat" ? 0 : 1)
        : (tossDecision === "bat" ? 1 : 0),
        currentInnings: 1,
        overs: 2
    };
    
    localStorage.setItem("matchDetails", JSON.stringify(matchDetails));
    startInnings();

    window.location.href = "./live.html";
}

function startInnings(){
    matchDetails = JSON.parse(localStorage.getItem("matchDetails"));
    const battingTeam  = matchDetails.teams[matchDetails.battingIndex];
    const bowlingTeam  = matchDetails.teams[1 - matchDetails.battingIndex];

    const strikeName     = prompt("Enter Strike Batter Name:");
    const nonStrikeName  = prompt("Enter Non-Strike Batter Name:");
    const bowlerName     = prompt("Enter First Bowler Name:");

    if (!strikeName || !nonStrikeName || !bowlerName) {
        alert("All names are required.");
        return;
    }

    battingTeam.players.onField.push(
        { name: strikeName,    isStrike: true,  isOut: false, runs: 0, balls: 0, fours: 0, sixes: 0 },
        { name: nonStrikeName, isStrike: false, isOut: false, runs: 0, balls: 0, fours: 0, sixes: 0 }
    );

    bowlingTeam.bowlers.push({
        name: bowlerName,
        isBowling: true,
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0
    });

    localStorage.setItem("matchDetails", JSON.stringify(matchDetails));
}


function checkScore(){
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bt = md.teams[md.battingIndex];
    const bk = md.teams[1 - md.battingIndex];
    
    if (bt.score.runs > bk.score.runs){
        alert("Match over!");
        window.location.href = "summary.html";
    }
}

function handleBall(){
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bt = md.teams[md.battingIndex];
    const bk = md.teams[1 - md.battingIndex];
    const bowler     = bk.bowlers.find(b => b.isBowling);
    
    if (md.currentInnings === 2){
        console.log("Checking score");
        checkScore();
    }

    maxBalls = md.overs * 6;
    if (bt.score.balls >= maxBalls || bt.score.wickets == 10){
        if(md.currentInnings === 1){
            md.battingIndex = 1 - md.battingIndex;
            md.currentInnings++;
            localStorage.setItem("matchDetails", JSON.stringify(md));
            alert(`${bt.name}'s innings is over!`);
            startInnings();
        }
        else{
            alert('Match over!');
            window.location.href = "summary.html"
        }
    }
    else if (bt.score.balls % 6 === 0) {
        bowler.overs++;
        const nextBowler = prompt("Over complete! Enter next bowler:");
        if (nextBowler) {
            bk.bowlers.forEach(b => b.isBowling = false);
            bk.bowlers.push({
                name: nextBowler,
                isBowling: true,
                overs: 0,
                maidens: 0,
                runs: 0,
                wickets: 0
            });
        }
        localStorage.setItem("matchDetails", JSON.stringify(md));
    }

}


function addRun(runs) {
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bt = md.teams[md.battingIndex];
    const bk = md.teams[1 - md.battingIndex];

    const striker    = bt.players.onField.find(p => p.isStrike);
    const nonStriker = bt.players.onField.find(p => !p.isStrike);
    const bowler     = bk.bowlers.find(b => b.isBowling);

    bt.score.runs  += runs;
    bt.score.balls += 1;
    striker.runs  += runs;
    striker.balls += 1;
    if (runs === 4) striker.fours++;
    if (runs === 6) striker.sixes++;

    if (runs % 2 === 1) {
        striker.isStrike    = false;
        nonStriker.isStrike = true;
    }

    localStorage.setItem("matchDetails", JSON.stringify(md));
    handleBall();

    updateLiveDisplay();
}

function recordWicket() {
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bt = md.teams[md.battingIndex];
    const bk = md.teams[1 - md.battingIndex];

    const striker = bt.players.onField.find(p => p.isStrike);
    const bowler  = bk.bowlers.find(b => b.isBowling);

    striker.isOut = true;
    bt.players.out.push(striker);
    bt.players.onField = bt.players.onField.filter(p => p !== striker);
    bt.score.wickets++;
    bt.score.balls++;

    bowler.wickets++;

    const newBatter = prompt("Wicket! Enter new batter:");
    if (newBatter) {
        bt.players.onField.push({
            name: newBatter,
            isStrike: true,
            isOut: false,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0
        });
        bt.players.onField.forEach(p => {
            if (p.name !== newBatter) p.isStrike = false;
        });
    }

    localStorage.setItem("matchDetails", JSON.stringify(md));
    handleBall();

    updateLiveDisplay();
}

function updateOverallScores() {
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bt = md.teams[md.battingIndex];
    const bk = md.teams[1 - md.battingIndex];

    const overs = Math.floor(bt.score.balls / 6);
    const balls = bt.score.balls % 6;
    const firstInnings = md.currentInnings === 1;

    const scoreDisplay = document.getElementById("scoreDisplay");
    if (firstInnings) {
        scoreDisplay.textContent = `${bt.name} ${bt.score.runs}/${bt.score.wickets} (${overs}.${balls}) vs. ${bk.name}`;
    } else {
        const bkOvers = Math.floor(bk.score.balls / 6);
        const bkBalls = bk.score.balls % 6;
        scoreDisplay.textContent = `${bt.name} ${bt.score.runs}/${bt.score.wickets} (${overs}.${balls}) vs. ${bk.name} ${bk.score.runs}/${bk.score.wickets} (${bkOvers}.${bkBalls})`;
    }
}

function updateBatterTable() {
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bt = md.teams[md.battingIndex];
    const batterTable = document.querySelector("#battersTable tbody");

    const strikeBatter = bt.players.onField.find(p => p.isStrike);
    const nonStrikeBatter = bt.players.onField.find(p => !p.isStrike);

    const calculateStrikeRate = (runs, balls) => (balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00");

    batterTable.innerHTML = `
        <tr>
        <td>${strikeBatter.name}</td>
        <td>${strikeBatter.runs}</td>
        <td>${strikeBatter.balls}</td>
        <td>${strikeBatter.fours}</td>
        <td>${strikeBatter.sixes}</td>
        <td>${calculateStrikeRate(strikeBatter.runs, strikeBatter.balls)}</td>
        </tr>
        <tr>
        <td>${nonStrikeBatter.name}</td>
        <td>${nonStrikeBatter.runs}</td>
        <td>${nonStrikeBatter.balls}</td>
        <td>${nonStrikeBatter.fours}</td>
        <td>${nonStrikeBatter.sixes}</td>
        <td>${calculateStrikeRate(nonStrikeBatter.runs, nonStrikeBatter.balls)}</td>
        </tr>
        `;
}

function updateBowlingSection() {
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bk = md.teams[1 - md.battingIndex];
    const bowler = bk.bowlers.find(b => b.isBowling);
    const bowlingSection = document.getElementById("bowlerStats");

    const calculateEconomyRate = (runs, overs) => (overs > 0 ? (runs / overs).toFixed(2) : "0.00");

    bowlingSection.innerHTML = `
        <p>${bowler.name}</p>
        <ul>
        <li>Overs: ${bowler.overs}</li>
        <li>Maidens: ${bowler.maidens}</li>
        <li>Runs Conceded: ${bowler.runs}</li>
        <li>Wickets: ${bowler.wickets}</li>
        <li>Economy Rate: ${calculateEconomyRate(bowler.runs, bowler.overs)}</li>
        </ul>
        `;
}

function updateLiveDisplay() {
    updateOverallScores();
    updateBatterTable();
    updateBowlingSection();
}

function updateBattingScorecard() {
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    md.teams.forEach(team => {
        const teamRow = document.createElement("tr");
        teamRow.innerHTML = `<td colspan="6"><strong>${team.name}</strong></td>`;
        battingScorecard.querySelector("tbody").appendChild(teamRow);

        team.players.onField.concat(team.players.out).forEach(player => {
            const strikeRate = player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(2) : "0.00";
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.runs}</td>
                <td>${player.balls}</td>
                <td>${player.fours}</td>
                <td>${player.sixes}</td>
                <td>${strikeRate}</td>
                `;
            battingScorecard.querySelector("tbody").appendChild(row);
        });
    });
}

function updateBowlingScorecard() {
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    md.teams.forEach(team => {
        const teamRow = document.createElement("tr");
        teamRow.innerHTML = `<td colspan="6"><strong>${team.name}</strong></td>`;
        bowlingScorecard.querySelector("tbody").appendChild(teamRow);

        team.bowlers.forEach(bowler => {
            const overs = Math.floor(bowler.balls / 6) + "." + (bowler.balls % 6);
            const economyRate = bowler.balls > 0 ? (bowler.runs / (bowler.balls / 6)).toFixed(2) : "0.00";
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${bowler.name}</td>
                <td>${bowler.overs}</td>
                <td>${bowler.maidens}</td>
                <td>${bowler.runs}</td>
                <td>${bowler.wickets}</td>
                <td>${economyRate}</td>
                `;
            bowlingScorecard.querySelector("tbody").appendChild(row);
        });
    });
}

function updateScorecard(){
    updateBowlingScorecard();
    updateBattingScorecard();
}

function displayResult(){
    const md = JSON.parse(localStorage.getItem("matchDetails"));
    const bt = md.teams[md.battingIndex];
    const bk = md.teams[1 - md.battingIndex];
    const resultElement = document.getElementById("matchResult");

    if(bt.score.runs > bk.score.runs){
        const wicketsLeft = 10 - bt.score.wickets;
        const ballsLeft = (md.overs * 6) - bt.score.balls;
        resultMessage = `${bt.name} wins by ${wicketsLeft} wickets (${ballsLeft} balls left)!`;
    }
    else if(bt.score.runs < bk.score.runs){
        const runDifference = bk.score.runs - bt.score.runs;
        resultMessage = `${bk.name} wins by ${runDifference} runs!`;
    }
    else{resultMessage = "It's a tie!";}

    resultElement.innerHTML = `
    <h2>Match Result</h2>
    <p><strong>${bk.name}:</strong> ${bk.score.runs}</p>
    <p><strong>${bt.name}:</strong> ${bt.score.runs}</p>
    <h3>${resultMessage}</h3>
  `;

}

function resetMatch() {
    localStorage.clear();
    window.location.href = "./setup.html";
}
