export default class Piece {
  constructor(color, position) {
    this.color = color;
    this.position = position;
  }

  getPossibleMoves(board) {
    throw new Error("Doit être implémenter par les sous classes");
  }
}
