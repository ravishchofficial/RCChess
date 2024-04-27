export const getPointerPosition = (evt: any, boundingBox: DOMRect) => {
	const x = evt.clientX - boundingBox.x;
	const y = evt.clientY - boundingBox.y;

	return [x, y];
};

export const getBoard = (board: number[][], reverse?: boolean) => {
	if (reverse) {
		return board.map((row) => row.reverse()).reverse();
	}
	return board;
};

// Move related

const inBoardRange = (row: number, col: number) =>
	row < 8 && col < 8 && row >= 0 && col >= 0;
const isBlack = (piece: number) => piece < 0;
const isWhite = (piece: number) => piece > 0;

export const calculateKingMove = ({
	row,
	col,
	board,
}: {
	row: number;
	col: number;
	board: number[][];
}) => {
	const piece = board[row][col];
	const moves: number[][] = [];
	const directions = [
		[1, 0],
		[0, 1],
		[-1, 0],
		[0, -1],
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1],
	];
	directions.forEach((direction) => {
		const newRow = row + direction[0];
		const newCol = col + direction[1];
		if (
			inBoardRange(newRow, newCol) &&
			((isBlack(piece) && !isBlack(board[newRow][newCol])) ||
				(isWhite(piece) && !isWhite(board[newRow][newCol])))
		) {
			moves.push([newRow, newCol]);
		}
	});

	return moves;
};

export const calculateQueenMove = ({
	row,
	col,
	board,
}: {
	row: number;
	col: number;
	board: number[][];
}) => {
	const moves: number[][] = calculateRookMove({ row, col, board }).concat(
		calculateBishopMove({ row, col, board })
	);

	return moves;
};

export const calculateRookMove = ({
	row,
	col,
	board,
}: {
	row: number;
	col: number;
	board: number[][];
}) => {
	const piece = board[row][col];
	const moves: number[][] = [];

	// Towards Right
	for (let i = col + 1; i < 8; i++) {
		if (isBlack(piece)) {
			if (isBlack(board[row][i])) break;
			moves.push([row, i]);
			if (isWhite(board[row][i])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[row][i])) break;
			moves.push([row, i]);
			if (isBlack(board[row][i])) break;
		}
	}

	// Towards Left
	for (let i = col - 1; i >= 0; i--) {
		if (isBlack(piece)) {
			if (isBlack(board[row][i])) break;
			moves.push([row, i]);
			if (isWhite(board[row][i])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[row][i])) break;
			moves.push([row, i]);
			if (isBlack(board[row][i])) break;
		}
	}

	// Towards Bottom
	for (let i = row + 1; i < 8; i++) {
		if (isBlack(piece)) {
			if (isBlack(board[i][col])) break;
			moves.push([i, col]);
			if (isWhite(board[i][col])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[i][col])) break;
			moves.push([i, col]);
			if (isBlack(board[i][col])) break;
		}
	}

	// Towards Top
	for (let i = row - 1; i >= 0; i--) {
		if (isBlack(piece)) {
			if (isBlack(board[i][col])) break;
			moves.push([i, col]);
			if (isWhite(board[i][col])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[i][col])) break;
			moves.push([i, col]);
			if (isBlack(board[i][col])) break;
		}
	}

	return moves;
};

export const calculateKnightMove = ({
	row,
	col,
	board,
}: {
	row: number;
	col: number;
	board: number[][];
}) => {
	const piece = board[row][col];
	const moves: number[][] = [];

	const directions = [
		[2, 1],
		[1, 2],
		[2, -1],
		[1, -2],
		[-2, 1],
		[-1, 2],
		[-2, -1],
		[-1, -2],
	];

	directions.forEach((direction) => {
		if (
			inBoardRange(row + direction[0], col + direction[1]) &&
			((isBlack(piece) &&
				!isBlack(board[row + direction[0]][col + direction[1]])) ||
				(isWhite(piece) &&
					!isWhite(board[row + direction[0]][col + direction[1]])))
		) {
			moves.push([row + direction[0], col + direction[1]]);
		}
	});

	return moves;
};

export const calculateBishopMove = ({
	row,
	col,
	board,
}: {
	row: number;
	col: number;
	board: number[][];
}) => {
	const piece = board[row][col];
	const moves: number[][] = [];

	// Towards Bottom-Right
	for (let i = row + 1, j = col + 1; inBoardRange(i, j); i++, j++) {
		if (isBlack(piece)) {
			if (isBlack(board[i][j])) break;
			moves.push([i, j]);
			if (isWhite(board[i][j])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[i][j])) break;
			moves.push([i, j]);
			if (isBlack(board[i][j])) break;
		}
	}

	// Towards Top-Right
	for (let i = row - 1, j = col - 1; inBoardRange(i, j); i--, j--) {
		if (isBlack(piece)) {
			if (isBlack(board[i][j])) break;
			moves.push([i, j]);
			if (isWhite(board[i][j])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[i][j])) break;
			moves.push([i, j]);
			if (isBlack(board[i][j])) break;
		}
	}

	// Towards Bottom-Left
	for (let i = row + 1, j = col - 1; inBoardRange(i, j); i++, j--) {
		if (isBlack(piece)) {
			if (isBlack(board[i][j])) break;
			moves.push([i, j]);
			if (isWhite(board[i][j])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[i][j])) break;
			moves.push([i, j]);
			if (isBlack(board[i][j])) break;
		}
	}

	// Towards Top-Left
	for (let i = row - 1, j = col + 1; inBoardRange(i, j); i--, j++) {
		if (isBlack(piece)) {
			if (isBlack(board[i][j])) break;
			moves.push([i, j]);
			if (isWhite(board[i][j])) break;
		} else if (isWhite(piece)) {
			if (isWhite(board[i][j])) break;
			moves.push([i, j]);
			if (isBlack(board[i][j])) break;
		}
	}

	return moves;
};

export const calculatePawnMove = ({
	row,
	col,
	board,
	reversedBoard,
}: {
	row: number;
	col: number;
	board: number[][];
	reversedBoard?: boolean;
}) => {
	const piece = board[row][col];
	const moves: number[][] = [];
	if (reversedBoard ? isWhite(piece) : isBlack(piece)) {
		// For Black
		if (row === 1 && board[row + 2][col] === 0) {
			moves.push([row + 2, col]);
		}

		if (board[row + 1][col] === 0) {
			moves.push([row + 1, col]);
		}

		// Check for attack
		if (
			reversedBoard
				? isBlack(board[row + 1][col - 1])
				: isWhite(board[row + 1][col - 1])
		)
			moves.push([row + 1, col - 1]);
		if (
			reversedBoard
				? isBlack(board[row + 1][col + 1])
				: isWhite(board[row + 1][col + 1])
		)
			moves.push([row + 1, col + 1]);
	} else if (reversedBoard ? isBlack(piece) : isWhite(piece)) {
		// For White
		if (row === 6 && board[row - 2][col] === 0) {
			moves.push([row - 2, col]);
		}

		if (board[row - 1][col] === 0) {
			moves.push([row - 1, col]);
		}

		// Check for attack
		if (
			reversedBoard
				? isWhite(board[row - 1][col + 1])
				: isBlack(board[row - 1][col + 1])
		)
			moves.push([row - 1, col + 1]);
		if (
			reversedBoard
				? isBlack(board[row - 1][col - 1])
				: isBlack(board[row - 1][col - 1])
		)
			moves.push([row - 1, col - 1]);
	}
	return moves.filter((move) => inBoardRange(move[0], move[1]));
};

/**
 * TODO:
 * - Castling
 * - Check calculating
 * - Pawn conversion
 * - En passant
 */
