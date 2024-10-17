import Piece from "./Piece";

export default class King extends Piece {
  getPossibleMoves(board) {
    const moves = [];
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ];

    for (let { dx, dy } of directions) {
      const x = this.position.x + dx;
      const y = this.position.y + dy;
      if (
        board.isValidPosition(x, y) &&
        (board.isEmpty(x, y) || board.isEnemyPiece(x, y, this.color))
      ) {
        moves.push({ x, y });
      }
    }

    // Roque (à implémenter ultérieurement)

    return moves;
  }
}
