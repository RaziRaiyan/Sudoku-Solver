import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App  extends Component{

  initialBoardState = new Set();

  constructor() {
    super();
    this.state = {
      board : [
        ["1","","","","5","","7","",""],
        ["","2","","","9","","","",""],
        ["","","3","","","6","","",""],
        ["","","","","","","","",""],
        ["","","","","8","","","",""],
        ["","","","","","","","",""],
        ["","3","","7","","","1","",""],
        ["","","","","","","","5",""],
        ["","","4","5","","","","2",""],
      ]
    };

    this.state.board.forEach((row,rowIndex) => {
      row.forEach((val,columnIndex) => {
        if(val !== ""){
          this.initialBoardState.add(rowIndex+""+columnIndex);
        }
      })
    });

    // console.log(this.initialBoardState);

  }


  async solveSudoku(){
    const out = await this.canSolveSudokuFromCell(0,0,this.state.board);
    // console.log(out);
    console.log(out);
    if(out){
      console.log('Solved the sudoku');
      console.log(this.state.board);
    }else{
      console.log('Unable to solve the sudoku');
    }
  }

  async canSolveSudokuFromCell(row,col,board){
    if(col === board[row].length) {
      col = 0;
      row++;

      if(row === board.length){
        this.setState({
              board: board
            }
        );
        console.log(board);
        return true;
      }
    }

    if(board[row][col] !== ""){
      return await this.canSolveSudokuFromCell(row,col+1,board);
    }

    for(let val = 1;val <= board.length ; val++){
      let charToPlace = val;
      await  this.timeout(1);
      if(this.canPlaceValue(board,row,col,charToPlace)){
        // await this.timeout(500);
        board[row][col] = charToPlace;
        // console.log(row,col,charToPlace);
        document.getElementById(`cell-${row}-${col}`).innerText = charToPlace;
        document.getElementById(`cell-${row}-${col}`).classList.add("cell-operating");
        if(await this.canSolveSudokuFromCell(row,col+1,board)){
          return true;
        }
        // await this.timeout(500);
        document.getElementById(`cell-${row}-${col}`).innerText = "";
        document.getElementById(`cell-${row}-${col}`).classList.remove("cell-operating");
        board[row][col] = "";
      }
    }

    return false;
  }

  timeout(ms){
    return new Promise(resolve => {setTimeout(resolve,ms)});
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
                let cellClass = "cell" + (this.initialBoardState.has(rowIndex+""+columnIndex)  ?  " cell__occupied": "");
                cellClass += (columnIndex!=0 && columnIndex%3 == 0 ? " colBoundary":"");
                cellClass += (rowIndex != 8 &&  (rowIndex+1)%3 == 0 ? " rowBoundary":"");
                return (
                    <div
                        id={`cell-${rowIndex}-${columnIndex}`}
                        className={cellClass} key={rowIndex+""+columnIndex}>
                      {cell}
                    </div>);
              })
            })}
          </div>

          <button className="btn__solve" onClick={() => this.solveSudoku()}>Solve</button>
        </div>
    );
  }

}


export default App;
