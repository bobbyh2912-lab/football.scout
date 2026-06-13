// ===============================
// MOCK DATABASE
// ===============================
const PLAYERS = [
  {
    name: "Erling Haaland",
    team: "Man City",
    position: "ST",
    value: 180,
    stats: { goals: 32, xG: 28.4, xA: 5.2, shots90: 4.1, passPct: 78 }
  },
  {
    name: "Jude Bellingham",
    team: "Real Madrid",
    position: "CM",
    value: 160,
    stats: { goals: 18, xG: 12.3, xA: 9.8, shots90: 2.3, passPct: 88 }
  },
  {
    name: "Jamal Musiala",
    team: "Bayern",
    position: "CM",
    value: 140,
    stats: { goals: 12, xG: 10.1, xA: 7.2, shots90: 2.8, passPct: 91 }
  }
];

// ===============================
// TAB SWITCHING
// ===============================
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");
}

// ===============================
// "AI" NORMALISATION
// ===============================
function norm(stats) {
  return {
    xG_per90: stats.xG / 38,
    xA_per90: stats.xA / 38,
    shotQuality: stats.xG / (stats.shots90 || 1),
    passing: stats.passPct
  };
}

// ===============================
// PLAYER SEARCH
// ===============================
function searchPlayer() {
  const name = document.getElementById("playerName").value;

  const p = PLAYERS.find(x => x.name.toLowerCase() === name.toLowerCase());

  const out = document.getElementById("playerResult");

  if (!p) {
    out.innerHTML = "<p>Player not found (skill issue)</p>";
    return;
  }

  const n = norm(p.stats);

  out.innerHTML = `
    <div class="card">
      <h3>${p.name}</h3>
      <p>Team: ${p.team}</p>
      <p>xG/90: ${n.xG_per90.toFixed(2)}</p>
      <p>xA/90: ${n.xA_per90.toFixed(2)}</p>
      <p>Passing: ${n.passing}</p>
    </div>
  `;
}

// ===============================
// SCOUT MODE
// ===============================
function scout() {
  const position = document.getElementById("position").value;
  const style = document.getElementById("style").value;

  const results = PLAYERS.map(p => {
    const n = norm(p.stats);

    let fit = 0;

    if (p.position !== position) fit = 0;
    else if (style === "possession") fit = n.passing * 0.6;
    else fit = n.shotQuality * 50;

    const realism = 100 - Math.abs(p.value - 150);

    return {
      ...p,
      fit,
      realism,
      total: fit * 0.7 + realism * 0.3
    };
  }).sort((a,b) => b.total - a.total);

  document.getElementById("scoutResults").innerHTML =
    results.map(p => `
      <div class="card">
        <h3>${p.name}</h3>
        <p>Club: ${p.team}</p>
        <p>Fit: ${p.fit.toFixed(1)}</p>
        <p>Realism: ${p.realism.toFixed(1)}</p>
        <p>Total: ${p.total.toFixed(1)}</p>
      </div>
    `).join("");
}
