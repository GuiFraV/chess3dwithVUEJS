export default class Board {
  constructor() {
    this.grid = this.initializeBoard();
  }

  initializeBoard() {
    const grid = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    return grid;
  }

  isValidPosition(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  isEmpty(x, y) {
    return this.isValidPosition(x, y) && this.grid[x][y] === null;
  }

  isEnemyPiece(x, y, color) {
    return (
      this.isValidPosition(x, y) &&
      this.grid[x][y] !== null &&
      this.grid[x][y].color !== color
    );
  }

  getLinearMoves(position, color, directions) {
    const moves = [];
    for (let { dx, dy } of directions) {
      let x = position.x + dx;
      let y = position.y + dy;
      while (this.isValidPosition(x, y)) {
        if (this.isEmpty(x, y)) {
          moves.push({ x, y });
        } else {
          if (this.isEnemyPiece(x, y, color)) {
            moves.push([x, y]);
          }
          break;
        }
        x += dx;
        y += dy;
      }
    }
    return moves;
  }
}
