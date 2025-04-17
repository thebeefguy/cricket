document.addEventListener("DOMContentLoaded", function() {
  const setupForm = document.getElementById('setupForm');
  if (setupForm) {
    setupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const team1 = document.getElementById('team1').value;
      const team2 = document.getElementById('team2').value;
      const tossWinner = document.getElementById('tossWinner').value;
      const tossDecision = document.getElementById('tossDecision').value;
      
      const matchDetails = {
        team1: team1,
        team2: team2,
        tossWinner: tossWinner,
        tossDecision: tossDecision,
        overs: 2
      };
      
      localStorage.setItem('matchDetails', JSON.stringify(matchDetails));
      
      window.location.href = "live.html";
    });
  }
});

