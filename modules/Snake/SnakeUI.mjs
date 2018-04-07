import GameUI from "../Engine/GameUI.mjs"

export default class SnakeUI extends GameUI {
  constructor(params) {
    super(params);
  }

  showScores(scores) {
    let element = this.menus["HIGH_SCORES"];
    let scoresTable = element.find("#high-scores-list")[0];
    let rows = scoresTable.rows;
    let i = rows.length - 1;
    while (i > 0) {
      scoresTable.deleteRow(i);
      i--;
    }
  
    scores.sort(function(a, b){return a - b});
    i = 1;
    let top5 = _.takeRight(scores, 5).reverse();
    for (const score of top5) {
      let row = scoresTable.insertRow(i);
      let scoreCell = row.insertCell(0);
      scoreCell.innerHTML = score;
      i++;
    }
  }
}
