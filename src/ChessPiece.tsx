import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faChessBishop,
    faChessKing,
    faChessKnight,
    faChessPawn,
    faChessQueen,
    faChessRook,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
    blackPieceColor,
    pieceScaleFactor,
    selectedPieceColor,
    squareHeight,
    squareWidth,
    whitePieceColor,
} from "./board";
import { Piece } from "./model/chessGameModel";
import { GamePlayState } from "./model/gamePlayState";

type PieceProps = {
    x: number;
    y: number;
    piece: Piece;
    gamePlayState: GamePlayState;
    onSelectPiece: (piece: Piece) => void;
};

export const ChesssPiece = ({ piece, gamePlayState, onSelectPiece, x, y }: PieceProps) => {
    const width = squareWidth * pieceScaleFactor;
    const height = squareHeight * pieceScaleFactor;

    let icon: IconDefinition;
    switch (piece.type) {
        case "Pawn":
            icon = faChessPawn;
            break;
        case "Rook":
            icon = faChessRook;
            break;
        case "Knight":
            icon = faChessKnight;
            break;
        case "Bishop":
            icon = faChessBishop;
            break;
        case "Queen":
            icon = faChessQueen;
            break;
        case "King":
            icon = faChessKing;
            break;
        default:
            icon = faQuestion;
    }

    let color = piece.player === "White" ? whitePieceColor : blackPieceColor;
    if (gamePlayState.selectedPiece && gamePlayState.selectedPiece.id === piece.id) {
        color = selectedPieceColor;
    }

    return (
        <FontAwesomeIcon
            key={piece.id}
            onClick={() => onSelectPiece(piece)}
            icon={icon}
            width={width}
            height={height}
            x={x}
            y={y}
            style={{ color: color }}
        />
    );
};
