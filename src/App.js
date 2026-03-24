import { useState } from 'react';

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const x = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = ([...history.slice(0, currentMove + 1), nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0 && move != currentMove) {
      description = "Go to move #" + move;
    } else if (move === currentMove) { 
      description = "You are at move " + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board x={x} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Square({ value, onSquareClick, isWinner}) {
  return (
    <button 
      className={isWinner ? 'winningSquare' : 'square'} 
      onClick={onSquareClick}

    >
      {value}
    </button>
  );
}

function Board({ x, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) { // return early is square is already filled
      return;
    }

    const nextSquares = squares.slice();
    if (x) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const line = result?.line ?? []; // return line if not null, otherwise return empty array

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (x ? "X" : "O");
  }

  return (
    <>
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinner={line.includes(0)}/>
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinner={line.includes(1)}/>
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinner={line.includes(2)}/>
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinner={line.includes(3)}/>
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinner={line.includes(4)}/>
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinner={line.includes(5)}/>
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinner={line.includes(6)}/>
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinner={line.includes(7)}/>
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinner={line.includes(8)}/>
    </div>
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], 
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c ] };
    }
  }
  return null;
}

