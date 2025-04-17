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
        score: 0,
        wickets: 0,
        balls: 0,
        batters: [],
        bowlers: []
      };

      const team2 = {
        name: team2Name,
        score: 0,
        wickets: 0,
        balls: 0,
        batters: [],
        bowlers: []
      };

      const matchDetails = {
        tossWinner: tossWinner,
        tossDecision: tossDecision,
        overs: 2,
        innings: 1,
        team1: team1,
        team2: team2
      };

      localStorage.setItem("matchDetails", JSON.stringify(matchDetails));

      window.location.href = "./live.html"; 
    });
  }
});

