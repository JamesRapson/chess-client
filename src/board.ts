import { Files, Ranks } from "./model/chessGameModel";

export const blackSquareColor = "#9e2a2b";
export const whiteSquareColor = "#fff3b0";

export const blackPieceColor = "black";
export const whitePieceColor = "#e09f3e";
export const selectedPieceColor = "green";
export const squareWidth = 120;
export const squareHeight = 120;
export const pieceScaleFactor = 0.7;
export const boardWidth = 8 * squareWidth;
export const boardHeight = 8 * squareHeight;

export const getSquaresCoordinates = (rank: Ranks, file: Files): { x: number; y: number } => {
    const x = file * squareWidth;
    const y = boardHeight - rank * squareHeight - squareHeight;
    return { x, y };
};
