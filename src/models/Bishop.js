import Piece from "./Piece";

export default class Bishop extends Piece {
  getPossibleMoves(board) {
    return board.getLinearMoves(this.position, this.color, [
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ]);
  }
}
