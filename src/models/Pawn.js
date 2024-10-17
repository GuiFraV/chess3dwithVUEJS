import Piece from "./Piece";

export default class Pawn extends Piece {
  constructor(color, position) {
    super(color, position);
    this.hasMoved = false;
  }

  getPossibleMoves(board) {
    const moves = [];
    const direction = this.color === "white" ? 1 : -1;
    const { x, y } = this.position;

    if (board.isEmpty(x, y + direction)) {
      moves.push({ x, y: y + direction });

      if (!this.hasMoved && board.isEmpty(x, y + 2 * direction)) {
        moves.push({ x, y: y + 2 * direction });
      }
    }

    for (let dx of [-1, 1]) {
      const nx = x + dx;
      const ny = y + direction;
      if (board.isEnemyPiece(nx, ny, this.color)) {
        moves.push({ x: nx, y: ny });
      }
    }

    return moves;
  }
}
