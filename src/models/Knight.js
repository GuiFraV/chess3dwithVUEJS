import Piece from "./Piece";

export default class Knight extends Piece {
  getPossibleMoves(board) {
    const moves = [];
    const movesPattern = [
      { dx: 1, dy: 2 },
      { dx: 2, dy: 1 },
      { dx: -1, dy: 2 },
      { dx: -2, dy: 1 },
      { dx: 1, dy: -2 },
      { dx: 2, dy: -1 },
      { dx: -1, dy: -2 },
      { dx: -2, dy: -1 },
    ];

    for (let { dx, dy } of movesPattern) {
      const x = this.position.x + dx;
      const y = this.position.y + dy;
      if (
        board.isValidPosition(x, y) &&
        (board.isEmpty(x, y) || board.isEnemyPiece(x, y, this.color))
      ) {
        moves.push({ x, y });
      }
    }

    return moves;
  }
}
