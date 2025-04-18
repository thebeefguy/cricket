document.addEventListener("DOMContentLoaded", () => {
  const setupForm = document.getElementById("setupForm");
  if (setupForm) setupForm.addEventListener("submit", handleSetup);
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
  window.location.href = "./live.html";
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

  if (bt.score.balls % 6 === 0) {
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
  }

  localStorage.setItem("matchDetails", JSON.stringify(md));
  if (typeof updateLiveDisplay === "function") updateLiveDisplay();
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
  if (typeof updateLiveDisplay === "function") updateLiveDisplay();
}

