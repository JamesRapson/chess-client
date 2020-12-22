import { Board, Piece, Ranks, Files, Position, Player, ChessGame, Move, MovePart, PieceId } from './chessGameModel';
import { isInCheckMate, testIfPossibleMoves, isInCheck, doMove } from './playChessGame';
import { saveChessGame } from './api';

export type GamePlayState = {
    game?: ChessGame;
    selectedPiece?: Piece;
    selectedSquare?: Position;
    possibleMoves?: Position[];
    messages: string[];
};

export type GamePlayStateAction =
    | { type: "setGame"; game: ChessGame}
    | { type: "pauseGame" }
    | { type: "surenderGame" }
    | { type: "movePiece"; piece: Piece, position: Position }
    | { type: "selectPiece"; piece: Piece }
    | { type: "selectSquare"; square: Position }
    | { type: "setPossibleMoves"; moves: Position[] }
    | { type: "undoMove"; }
    | { type: "redoMove"; }
    | { type: "saveGame"; }



export const initialgamePlayState: GamePlayState = {
    messages: [],
};  

export const gamePlayStateReducer = (state: GamePlayState, action: GamePlayStateAction): GamePlayState => {

    console.log("gamePlayStateReducer", action);
    switch (action.type) {
        case "setGame":
            {
                const newState = { ...state };
                newState.game = action.game;
                return newState;
            }
        case "movePiece":
            {
                return processMovePiece(state, action.piece, action.position);
            }
        case "selectPiece":
            {
                const newState = { ...state };
                newState.selectedPiece = action.piece;
                newState.possibleMoves = undefined;
                return newState;
            }
        case "selectSquare":
            {
                const newState = { ...state };
                newState.selectedSquare = action.square;
                return newState;
            }
        case "setPossibleMoves":
            {
                const newState = { ...state };
                newState.possibleMoves = action.moves
                return newState;
            }
        case "undoMove":
            {
                if (!state.game) return state;
                if (!state.game.moves || state.game.moves.length === 0) return state;
                undoLastMove(state.game);
                state.selectedPiece = undefined;
                state.possibleMoves = undefined;
                const newState = { ...state };
                return newState;
            }
        case "redoMove":
            {
                // TODO
                const newState = { ...state };
                return newState;
            }
        case "saveGame":
            {
                if (state.game) {
                    saveChessGame(state.game);
                }
                const newState = { ...state };
                return newState;
            }

        default:
            console.warn("gamePlayStateReducer: unknown action:" + (action as any).type);
            return state;
    }
};


const processMovePiece = (state: GamePlayState, piece: Piece, position: Position) => {

    if (!state.game) return state;

    const newState = { ...state };
    if (!newState.game) return state;

    doMove(state.game, piece, position);
    
    newState.messages = [];
    newState.selectedPiece = undefined;
    newState.possibleMoves = undefined;
    if (!newState.game.start) newState.game.start = new Date();

    // check if the move puts the player in check. If so this is an illegal move and we need to undo the move
    let pieceToTakeKing = isInCheck(newState.game.currentBoard.pieces, piece.player);
    if (pieceToTakeKing) {
        if (newState.game.inCheck)
            newState.messages.push(`Invalid move. ${piece.player} must move out of check`);
        else
            newState.messages.push(`Invalid move. This move would put you in Check. Piece ${pieceToTakeKing.id} can take ${piece.player} king`);

        //undo the move
        undoLastMove(state.game);
        newState.game.playersTurn = piece.player;
        return newState;
    }

    const otherPlayer = getOtherPlayer(newState.game.playersTurn);

    //test if the other player has no possible moves -> draw
    if (!testIfPossibleMoves(newState.game.currentBoard.pieces, otherPlayer)) {
        newState.messages.push(`Game is a draw ${otherPlayer} has no possible moves`);
        newState.game.currentState = "Draw";
        return newState;
    }

    //test if the other player is in CHECKMATE
    if (isInCheckMate(newState.game.currentBoard.pieces, otherPlayer)) {
        newState.messages.push(`Checkmate. Player ${otherPlayer} is in checkmate`);
        newState.game.currentState = otherPlayer === "Black" ? "BlackInCheckmate" : "WhiteInCheckmate";
        return newState;
    }

    //test if the other player is in CHECK
    pieceToTakeKing = isInCheck(newState.game.currentBoard.pieces, otherPlayer);
    if (pieceToTakeKing) {
        newState.messages.push(`Check. Player ${otherPlayer} is in check`);
    } else {
        newState.game.inCheck = undefined;
    }

    newState.game.playersTurn = otherPlayer;
    return newState;
}

const undoLastMove = (game: ChessGame) => {
    
    if (!game.moves || game.moves.length === 0) return;
    const lastMove = game.moves.pop();
    if (lastMove) {
        lastMove.pieceMoves.forEach(move => {
            move.piece.position = move.startPosition;
            move.piece.isOffBoard = false;
            move.piece.moveCount = move.piece.moveCount === 0 ? 0 : move.piece.moveCount - 1;
        })
    }
    game.playersTurn = getOtherPlayer(game.playersTurn);
    game.currentState = "Playing";
}

const getOtherPlayer = (player: Player) => {
    return player === "White" ? "Black" : "White";
}
