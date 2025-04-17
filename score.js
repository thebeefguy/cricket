document.addEventListener("DOMContentLoaded", function () {
  const setupForm = document.getElementById("setupForm");
  if (setupForm) {
    setupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const team1Name = document.getElementById("team1").value;
      const team2Name = document.getElementById("team2").value;
      const tossWinner = document.getElementById("tossWinner").value;
      const tossDecision = document.getElementById("tossDecision").value;

      const team1 = {
        name: team1Name,
        score: {
          runs: 0,
          wickets: 0,
          balls: 0
        },
        players: [],
        bowlers: []
      };

      const team2 = {
        name: team2Name,
        score: {
          runs: 0,
          wickets: 0,
          balls: 0
        },
        players: [],
        bowlers: []
      };

      const matchDetails = {
        teams: [team1, team2],
        tossWinner: tossWinner,
        tossDecision: tossDecision,
        currentInnings: 1,
        overs: 2
      };

      const battingIndex = tossWinner === "team1" && tossDecision === "bat" ? 0 : 1;
      matchDetails.teams[battingIndex].isBatting = true;
      matchDetails.teams[1 - battingIndex].isBowling = true;

      const strikeBatterName = prompt("Enter Strike Batter Name:");
      const nonStrikeBatterName = prompt("Enter Non-Strike Batter Name:");
      const currentBowlerName = prompt("Enter First Bowler Name:");

      if (!strikeBatterName || !nonStrikeBatterName || !currentBowlerName) {
        alert("All player names must be entered.");
        return;
      }

      matchDetails.teams[battingIndex].players.push(
        { name: strikeBatterName, isStrike: true, runs: 0, balls: 0, fours: 0, sixes: 0 },
        { name: nonStrikeBatterName, isStrike: false, runs: 0, balls: 0, fours: 0, sixes: 0 }
      );

      matchDetails.teams[1 - battingIndex].bowlers.push(
        { name: currentBowlerName, overs: 0, maidens: 0, runs: 0, wickets: 0, isBowling: true }
      );

      console.log("Match Details:", matchDetails);
      localStorage.setItem("matchDetails", JSON.stringify(matchDetails));

      window.location.href = "./live.html";
    });
  }
});

function addRun(runs) {
  let matchDetails = JSON.parse(localStorage.getItem("matchDetails"));

  const battingTeam = matchDetails.teams.find(team => team.isBatting);
  const bowlingTeam = matchDetails.teams.find(team => team.isBowling);
  const strikeBatter = battingTeam.players.find(player => player.isStrike);

  battingTeam.score.runs += runs;
  battingTeam.score.balls++;
  strikeBatter.runs += runs;
  strikeBatter.balls++;
  if (runs === 4) strikeBatter.fours++;
  if (runs === 6) strikeBatter.sixes++;

  if (runs % 2 === 1) {
    const nonStrikeBatter = battingTeam.players.find(player => !player.isStrike);
    strikeBatter.isStrike = false;
    nonStrikeBatter.isStrike = true;
  }

  if (battingTeam.score.balls % 6 === 0) {
    const currentBowler = bowlingTeam.bowlers.find(bowler => bowler.isBowling);
    currentBowler.overs++;

    const newBowlerName = prompt("Over complete! Enter next bowler name:");
    bowlingTeam.bowlers.forEach(bowler => (bowler.isBowling = false));
    bowlingTeam.bowlers.push({
      name: newBowlerName,
      overs: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      isBowling: true
    });
  }

  console.log("Updated Match Details:", matchDetails);
  localStorage.setItem("matchDetails", JSON.stringify(matchDetails));
}

