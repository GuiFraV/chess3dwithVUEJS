import Pawn from "./Pawn";
import Rook from "./Rook";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";

export default class Board {
  constructor() {
    this.grid = this.initializeBoard();
    this.lastMove = null; // Pour gérer la prise en passant
  }

  initializeBoard() {
    const grid = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Placement des pièces blanches
    grid[0][0] = new Rook("white", { x: 0, y: 0 });
    grid[1][0] = new Knight("white", { x: 1, y: 0 });
    grid[2][0] = new Bishop("white", { x: 2, y: 0 });
    grid[3][0] = new Queen("white", { x: 3, y: 0 });
    grid[4][0] = new King("white", { x: 4, y: 0 });
    grid[5][0] = new Bishop("white", { x: 5, y: 0 });
    grid[6][0] = new Knight("white", { x: 6, y: 0 });
    grid[7][0] = new Rook("white", { x: 7, y: 0 });
    for (let x = 0; x < 8; x++) {
      grid[x][1] = new Pawn("white", { x: x, y: 1 });
    }

    // Placement des pièces noires
    grid[0][7] = new Rook("black", { x: 0, y: 7 });
    grid[1][7] = new Knight("black", { x: 1, y: 7 });
    grid[2][7] = new Bishop("black", { x: 2, y: 7 });
    grid[3][7] = new Queen("black", { x: 3, y: 7 });
    grid[4][7] = new King("black", { x: 4, y: 7 });
    grid[5][7] = new Bishop("black", { x: 5, y: 7 });
    grid[6][7] = new Knight("black", { x: 6, y: 7 });
    grid[7][7] = new Rook("black", { x: 7, y: 7 });
    for (let x = 0; x < 8; x++) {
      grid[x][6] = new Pawn("black", { x: x, y: 6 });
    }

    return grid;
  }

  isValidPosition(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  getPieceAt(position) {
    if (this.isValidPosition(position.x, position.y)) {
      return this.grid[position.x][position.y];
    }
    return null;
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

  movePiece(from, to) {
    const piece = this.getPieceAt(from);
    if (!piece) return false;

    const possibleMoves = this.getPossibleMoves(piece);
    const isLegalMove = possibleMoves.some(
      (move) => move.x === to.x && move.y === to.y
    );

    if (isLegalMove) {
      // Gestion du roque
      if (piece instanceof King && Math.abs(to.x - from.x) === 2) {
        this.performCastling(piece, from, to);
      } else {
        // Déplacement normal
        this.updateBoardState(piece, from, to);

        // Gestion de la promotion des pions
        if (piece instanceof Pawn) {
          const endRow = piece.color === "white" ? 7 : 0;
          if (to.y === endRow) {
            // Promouvoir le pion en Reine (par défaut)
            this.grid[to.x][to.y] = new Queen(piece.color, to);
          }
        }

        // Gestion de la prise en passant
        this.handleEnPassant(piece, from, to);
      }

      // Mise à jour du dernier mouvement
      this.lastMove = { piece, from, to };
      piece.hasMoved = true;
      return true;
    }

    return false;
  }

  updateBoardState(piece, from, to) {
    // Gestion de la prise en passant
    if (piece instanceof Pawn && to.x !== from.x && this.isEmpty(to.x, to.y)) {
      // Capture en passant
      const direction = piece.color === "white" ? -1 : 1;
      this.grid[to.x][to.y + direction] = null;
    }

    // Mise à jour du plateau
    this.grid[to.x][to.y] = piece;
    this.grid[from.x][from.y] = null;
    piece.position = { x: to.x, y: to.y };
  }

  handleEnPassant(piece, from, to) {
    if (piece instanceof Pawn) {
      // Vérifier si le pion a avancé de deux cases
      if (Math.abs(to.y - from.y) === 2) {
        piece.canBeCapturedEnPassant = true;
      } else {
        piece.canBeCapturedEnPassant = false;
      }

      // Réinitialiser la possibilité de prise en passant pour les autres pions
      if (
        this.lastMove &&
        this.lastMove.piece instanceof Pawn &&
        this.lastMove.piece.color !== piece.color
      ) {
        this.lastMove.piece.canBeCapturedEnPassant = false;
      }
    } else {
      // Réinitialiser la possibilité de prise en passant pour les pions adverses
      if (
        this.lastMove &&
        this.lastMove.piece instanceof Pawn &&
        this.lastMove.piece.color !== piece.color
      ) {
        this.lastMove.piece.canBeCapturedEnPassant = false;
      }
    }
  }

  performCastling(king, from, to) {
    // Déterminer la direction du roque
    const deltaX = to.x - from.x;
    const rookX = deltaX > 0 ? 7 : 0; // Grand roque ou petit roque
    const newRookX = from.x + (deltaX > 0 ? -1 : 1);

    // Déplacer le roi
    this.grid[to.x][to.y] = king;
    this.grid[from.x][from.y] = null;
    king.position = { x: to.x, y: to.y };
    king.hasMoved = true;

    // Déplacer la tour
    const rook = this.getPieceAt({ x: rookX, y: from.y });
    this.grid[newRookX][from.y] = rook;
    this.grid[rookX][from.y] = null;
    rook.position = { x: newRookX, y: from.y };
    rook.hasMoved = true;
  }

  canCastle(king, to) {
    if (king.hasMoved) return false;

    const deltaX = to.x - king.position.x;
    const direction = deltaX > 0 ? 1 : -1;
    const rookX = deltaX > 0 ? 7 : 0;
    const rook = this.getPieceAt({ x: rookX, y: king.position.y });

    if (!rook || !(rook instanceof Rook) || rook.hasMoved) return false;

    // Vérifier que les cases entre le roi et la tour sont vides
    for (let x = king.position.x + direction; x !== rookX; x += direction) {
      if (!this.isEmpty(x, king.position.y)) return false;
    }
    return true;
  }

  getPossibleMoves(piece) {
    const basicMoves = piece.getPossibleMoves(this);

    // Gestion du roque pour le roi
    if (piece instanceof King) {
      const castlingMoves = [];
      const possibleCastlingPositions = [
        { x: piece.position.x - 2, y: piece.position.y },
        { x: piece.position.x + 2, y: piece.position.y },
      ];

      for (let to of possibleCastlingPositions) {
        if (this.canCastle(piece, to)) {
          castlingMoves.push(to);
        }
      }

      return basicMoves.concat(castlingMoves);
    }

    // Gestion de la prise en passant pour les pions
    if (piece instanceof Pawn) {
      const enPassantMoves = [];

      const direction = piece.color === "white" ? 1 : -1;
      const startRow = piece.color === "white" ? 4 : 3;

      if (piece.position.y === startRow) {
        for (let dx of [-1, 1]) {
          const x = piece.position.x + dx;
          const y = piece.position.y;
          if (this.isValidPosition(x, y)) {
            const adjacentPiece = this.getPieceAt({ x, y });
            if (
              adjacentPiece &&
              adjacentPiece instanceof Pawn &&
              adjacentPiece.color !== piece.color &&
              adjacentPiece.canBeCapturedEnPassant
            ) {
              enPassantMoves.push({ x: x, y: y + direction });
            }
          }
        }
      }

      return basicMoves.concat(enPassantMoves);
    }

    return basicMoves;
  }

  isCheck(color) {
    const kingPosition = this.findKingPosition(color);
    if (!kingPosition) return false;

    // Parcourez toutes les pièces ennemies et voyez si elles peuvent atteindre le roi
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = this.grid[x][y];
        if (piece && piece.color !== color) {
          const moves = this.getPossibleMoves(piece);
          if (
            moves.some(
              (move) => move.x === kingPosition.x && move.y === kingPosition.y
            )
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  findKingPosition(color) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = this.grid[x][y];
        if (piece instanceof King && piece.color === color) {
          return { x, y };
        }
      }
    }
    return null;
  }

  isCheckmate(color) {
    if (!this.isCheck(color)) return false;

    // Parcourez toutes les pièces du joueur
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = this.grid[x][y];
        if (piece && piece.color === color) {
          const moves = this.getPossibleMoves(piece);
          for (let move of moves) {
            // Simulez le mouvement
            const originalPosition = {
              x: piece.position.x,
              y: piece.position.y,
            };
            const capturedPiece = this.grid[move.x][move.y];
            this.grid[move.x][move.y] = piece;
            this.grid[piece.position.x][piece.position.y] = null;
            piece.position = { x: move.x, y: move.y };

            const isStillInCheck = this.isCheck(color);

            // Revenir à l'état précédent
            this.grid[originalPosition.x][originalPosition.y] = piece;
            this.grid[move.x][move.y] = capturedPiece;
            piece.position = originalPosition;

            if (!isStillInCheck) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }
}
