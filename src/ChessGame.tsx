import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useReducer } from "react";
import { boardHeight, boardWidth, getSquaresCoordinates, pieceScaleFactor, squareHeight, squareWidth } from "./board";
import { ChessBoard } from "./ChessBoard";
import { ChesssPiece } from "./ChessPiece";
import { Board, Files, Piece, Ranks } from "./model/chessGameModel";
import { gamePlayStateReducer, initialgamePlayState } from "./model/gamePlayState";
import { getPieceAtPosition, initialiseGame } from "./model/playChessGame";
import { getPossibleMoves } from "./model/possibleMoves";

type ChessGameProps = {};

export const ChessGame: React.FC<ChessGameProps> = () => {
    const [gamePlayState, gamePlayDispatcher] = useReducer(gamePlayStateReducer, initialgamePlayState);

    useEffect(() => {
        const game = initialiseGame();
        gamePlayDispatcher({ type: "setGame", game });
    }, []);

    const onSelectPiece = (piece: Piece) => {
        if (piece.isOffBoard) return;
        if (!gamePlayState.game || gamePlayState.game.playersTurn !== piece.player) return;

        gamePlayDispatcher({ type: "selectPiece", piece });
        gamePlayDispatcher({
            type: "setPossibleMoves",
            moves: getPossibleMoves(gamePlayState.game.currentBoard.pieces, piece),
        });
    };

    const onSelectSquare = (rank: Ranks, file: Files) => {
        if (!gamePlayState.game) return;

        if (gamePlayState.selectedPiece && gamePlayState.possibleMoves) {
            // move the selected piece to the clicked on square
            const match = gamePlayState.possibleMoves.find((move) => move.rank === rank && move.file === file);

            if (match) {
                gamePlayDispatcher({
                    type: "movePiece",
                    piece: gamePlayState.selectedPiece,
                    position: { rank, file },
                });
                return;
            }
        }

        const piece = getPieceAtPosition(gamePlayState.game.currentBoard.pieces, rank, file);
        if (piece) {
            if (!gamePlayState.selectedPiece || piece.id !== gamePlayState.selectedPiece.id) {
                // select the piece on the clicked on square
                onSelectPiece(piece);
            }
        }
    };

    const onUndoMove = () => {
        gamePlayDispatcher({ type: "undoMove" });
    };

    const onSaveGame = () => {
        gamePlayDispatcher({ type: "saveGame" });
    };

    const renderPieces = (pieces: Piece[]) => {
        let whiteOffBoardCount = 0;
        let blackOffBoardCount = 0;
        const offsetX = (squareWidth * (1 - pieceScaleFactor)) / 2;
        const offsetY = (squareHeight * (1 - pieceScaleFactor)) / 2;

        return pieces.map((piece) => {
            let { x, y } = getSquaresCoordinates(piece.position.rank, piece.position.file);
            x += offsetX;
            y += offsetY;

            if (piece.isOffBoard) {
                if (piece.player === "Black") {
                    x = 8 * squareWidth + (blackOffBoardCount % 4) * squareWidth + offsetX;
                    y = 7 * squareHeight - Math.floor(blackOffBoardCount / 4) * squareHeight + offsetY;
                    blackOffBoardCount++;
                } else {
                    x = 8 * squareWidth + (whiteOffBoardCount % 4) * squareWidth + offsetX;
                    y = Math.floor(whiteOffBoardCount / 4) * squareHeight + offsetY;
                    whiteOffBoardCount++;
                }
            }

            return (
                <ChesssPiece piece={piece} gamePlayState={gamePlayState} onSelectPiece={onSelectPiece} x={x} y={y} />
            );
        });
    };

    const renderPossibleMoves = (board: Board, piece: Piece) => {
        return (
            gamePlayState.possibleMoves &&
            gamePlayState.possibleMoves.map((pos, index) => {
                let { x, y } = getSquaresCoordinates(pos.rank, pos.file);
                x += squareWidth / 2;
                y += squareHeight / 2;

                return (
                    <circle
                        key={`PossibleMove${index}`}
                        cy={y}
                        cx={x}
                        r="20"
                        fill="blue"
                        onClick={() => onSelectSquare(pos.rank, pos.file)}
                    />
                );
            })
        );
    };

    return (
        <div>
            {gamePlayState.game && (
                <div
                    style={{
                        position: "absolute",
                        left: "20px",
                        fontSize: "24px",
                        maxWidth: "300px",
                    }}
                >
                    <div>Player : {gamePlayState.game.playersTurn}</div>
                    <div>Moves : {gamePlayState.game.moves.length}</div>
                    <div>
                        {gamePlayState.messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>
                    <button title="undo" onClick={() => onUndoMove()} style={{ padding: "2px", margin: "2px" }}>
                        <FontAwesomeIcon icon={faUndo} />
                    </button>
                    <button title="save" onClick={() => onSaveGame()} style={{ padding: "2px", margin: "2px" }}>
                        Save
                    </button>
                </div>
            )}
            {gamePlayState.game && gamePlayState.game.currentBoard && (
                <div
                    style={{
                        position: "absolute",
                        left: "400px",
                        top: "30px",
                    }}
                >
                    <svg key="board" width={boardWidth + 4 * squareWidth} height={boardHeight}>
                        <ChessBoard onSelectSquare={onSelectSquare} gamePlayState={gamePlayState} />
                        {renderPieces(gamePlayState.game.currentBoard.pieces)}
                        {gamePlayState.selectedPiece &&
                            renderPossibleMoves(gamePlayState.game.currentBoard, gamePlayState.selectedPiece)}
                    </svg>
                </div>
            )}
        </div>
    );
};
