import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App  extends Component{

  constructor() {
    super();
    this.state = {
      board : [
        ["1","2","3","4","5","6","7","8","9"],
        ["","","","","","","","",""],
        ["","","","","","","","",""],
        ["","","","","","","","",""],
        ["","","","","8","","","",""],
        ["","","","","","","","",""],
        ["","","","","","","","",""],
        ["","","","","","","","",""],
        ["","","","","","","","",""],
      ]
    }
  }

  solveSudoku(){
    const out = this.canSolveSudokuFromCell(0,0,this.state.board);
    console.log(out);
  }

  canSolveSudokuFromCell(row,col,board){
    if(col === board[row].length) {
      col = 0;
      row++;

      if(row === board.length){
        this.setState({
              board: board
            }
        );
        return true;
      }
    }

    if(board[row][col] !== ""){
      return this.canSolveSudokuFromCell(row,col+1,board);
    }

    for(let val = 1;val <= board.length ; val++){
      let charToPlace = val;

      if(this.canPlaceValue(board,row,col,charToPlace)){
        board[row][col] = charToPlace;
        if(this.canSolveSudokuFromCell(row,col+1,board)){
          return true;
        }
        board[row][col] = "";
      }
    }

    return false;
  }

  canPlaceValue(board,row,col,charToPlace){
    // Check column of the placement
    for(let i=0;i<board.length;i++){
      const placementRow = board[i];
      if(placementRow[col] == charToPlace){
        return false;
      }
    }

    // Check row of the placement
    for(let i=0;i<board[0].length; i++){
      if(charToPlace == board[row][i]){
        return false;
      }
    }

    // Check region constrains
    let regionSize = 3;

    let verticalBoxIndex = Math.floor(row/regionSize);
    let horizontalBoxIndex = Math.floor(col/regionSize);

    let topLeftOfSubBoxRow = regionSize * verticalBoxIndex;
    let topLeftOfSubBoxCol = regionSize * horizontalBoxIndex;

    for(let i=0; i < regionSize; i++){
      for(let j=0; j < regionSize; j++){
        if(charToPlace == board[topLeftOfSubBoxRow+i][topLeftOfSubBoxCol+j]){
          return false;
        }
      }
    }

    return true;
  }

  render() {
    return (

        <div className="App">

          <h1>Sudoku Solver</h1>

          <div className="board">
            {this.state.board.map((row,rowIndex) => {
              return row.map((cell,columnIndex) => {
                // console.log(cell,rowIndex,columnIndex);
                let cellClass = "cell" + (cell === "" ? "":" cell__occupied");
                return (<div className={cellClass} key={rowIndex+""+columnIndex}>{cell}</div>);
              })
            })}
          </div>

          <button className="btn__solve" onClick={() => this.solveSudoku()}>Solve</button>
        </div>
    );
  }

}


export default App;
