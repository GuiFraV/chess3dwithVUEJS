import Piece from "./Piece";

export default class Queen extends Piece {
  getPossibleMoves(board) {
    return board.getLinearMoves(this.position, this.color, [
      // Directions horizontales et verticales
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      // Directions diagonales
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ]);
  }
}
