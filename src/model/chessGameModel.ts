import React, { Component } from 'react';

export type Player = "White" | "Black";

export type ChessPieceType = "Pawn" | "Rook" | "Knight" | "Bishop" | "Queen" | "King";

export type PieceId = "White Kings Rook" | "White Kings Knight" | "White Kings Bishop" | "White Queen" | "White King" | "White Queens Bishop" | "White Queens Knight" | "White Queens Rook" | "Black Queens Rook" | "Black Queens Knight" | "Black Queens Bishop" | "Black Queen" | "Black King" | "Black Kings Bishop" | "Black Kings Knight" | "Black Kings Rook" | "White Pawn 1" | "White Pawn 2" | "White Pawn 3" | "White Pawn 4" | "White Pawn 5" | "White Pawn 6" | "White Pawn 7" | "White Pawn 8" | "Black Pawn 1" | "Black Pawn 2" | "Black Pawn 3" | "Black Pawn 4" | "Black Pawn 5" | "Black Pawn 6" | "Black Pawn 7" | "Black Pawn 8";

export type Ranks = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | -1;

export type Files = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | -1;

export type GameState = "Playing" | "BlackInCheckmate" | "WhiteInCheckmate" | "Draw" | "WhiteSurrender" | "BlackSurrender";

export interface Position {
    rank: Ranks,
    file: Files,
};

export interface Move {
    player: Player;
    pieceMoves: MovePart[];
}

export interface MovePart {
    piece: Piece;
    startPosition: Position;
    endPosition: Position;
}

export interface ChessGame {
    start?: Date;
    end?: Date;
    moves: Move[];
    winner?: Player;
    currentState: GameState;
    playersTurn: Player;
    currentBoard: Board;
    inCheck?: Player;
}

export interface Piece {
    id: PieceId;
    type: ChessPieceType;
    position: Position;
    player: Player;
    isOffBoard?: boolean;
    moveCount: number;
}

export interface Board {
    pieces: Piece[];
}
