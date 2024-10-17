import Piece from "./Piece";

export default class Rook extends Piece {
  getPossibleMoves(board) {
    return board.getLinearMoves(this.position, this.color, [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ]);
  }
}
