import Pack1 from "../components/pieces/pack1";
import Pack2 from "../components/pieces/pack2";

export const Packs = {
	pack1: Pack1,
	pack2: Pack2,
};

export enum Pieces {
	King = 6,
	Queen = 5,
	Rook = 4,
	Knight = 3,
	Bishop = 2,
	Pawn = 1,
}

// Negative represents black

export const INITIAL_BOARD = [
	[
		Pieces.Rook * -1,
		Pieces.Knight * -1,
		Pieces.Bishop * -1,
		Pieces.Queen * -1,
		Pieces.King * -1,
		Pieces.Bishop * -1,
		Pieces.Knight * -1,
		Pieces.Rook * -1,
	],
	[
		Pieces.Pawn * -1,
		Pieces.Pawn * -1,
		Pieces.Pawn * -1,
		Pieces.Pawn * -1,
		Pieces.Pawn * -1,
		Pieces.Pawn * -1,
		Pieces.Pawn * -1,
		Pieces.Pawn * -1,
	],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[
		Pieces.Pawn,
		Pieces.Pawn,
		Pieces.Pawn,
		Pieces.Pawn,
		Pieces.Pawn,
		Pieces.Pawn,
		Pieces.Pawn,
		Pieces.Pawn,
	],
	[
		Pieces.Rook,
		Pieces.Knight,
		Pieces.Bishop,
		Pieces.Queen,
		Pieces.King,
		Pieces.Bishop,
		Pieces.Knight,
		Pieces.Rook,
	],
];

export const BOX_SIZE = 1 / 8;

export const BOARD_DIMENSIONS = 1000;
// export const BOARD_DIMENSIONS = 800;

export enum COLORS {
	DARK = "#769656",
	LIGHT = "#eeeed2",
	SELECTION = "#baca44",
	DROPZONE = "#e0e0e0",
	MARKER = "#58545424",
}

// export enum COLORS {
// 	DARK = "#B7C0D8",
// 	LIGHT = "#E8EDF9",
// 	SELECTION = "#7B61FF",
// 	DROPZONE = "#e0e0e0",
// 	MARKER = "#7B61FF",
// }

export enum Turn {
	White = "white",
	Black = "black",
}
