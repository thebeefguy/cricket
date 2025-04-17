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
            team1: team1,
            team2: team2,
            tossWinner: tossWinner,
            tossDecision: tossDecision,
            currentInnings: 1,
            overs: 2,
            battingTeam: null, bowlingTeam: null,             
            playersOnField: {
                strikeBatter: null,
                nonStrikeBatter: null,
                currentBowler: null
            }
        };

        if (matchDetails.tossWinner === "team1") {
            if (matchDetails.tossDecision === "bat") {
                matchDetails.battingTeam = matchDetails.team1;
                matchDetails.bowlingTeam = matchDetails.team2;
            } else {
                matchDetails.battingTeam = matchDetails.team2;
                matchDetails.bowlingTeam = matchDetails.team1;
            }
        } else {
            if (matchDetails.tossDecision === "bat") {
                matchDetails.battingTeam = matchDetails.team2;
                matchDetails.bowlingTeam = matchDetails.team1;
            } else {
                matchDetails.battingTeam = matchDetails.team1;
                matchDetails.bowlingTeam = matchDetails.team2;
            }
        }


        const strikeBatter = prompt("Enter Strike Batter Name:");
        const nonStrikeBatter = prompt("Enter Non-Strike Batter Name:");
        const currentBowler = prompt("Enter First Bowler Name:");

        if (!strikeBatter || !nonStrikeBatter || !currentBowler) {
            alert("All player names must be entered.");
            return;
        }

        matchDetails.playersOnField.strikeBatter = {
            name: strikeBatter,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
        };

        matchDetails.playersOnField.nonStrikeBatter = {
            name: nonStrikeBatter,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
        };

        matchDetails.playersOnField.currentBowler = {
            name: currentBowler,
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0
        };

        matchDetails.battingTeam.players = [
            matchDetails.playersOnField.strikeBatter,
            matchDetails.playersOnField.nonStrikeBatter
        ];

        matchDetails.bowlingTeam.players = [matchDetails.playersOnField.currentBowler];

        console.log(matchDetails);
        localStorage.setItem("matchDetails", JSON.stringify(matchDetails));

        window.location.href = "./live.html";
    });
  }
});

