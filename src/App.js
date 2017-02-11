import React, { Component } from 'react';
import _ from 'lodash';

import './App.css';

const GameBoard = (props) => {	
	const width = props.size.width;	
	return(
		<div 
			className="gameBoardWrapper"
			style={{width: width * 10 + "px"}}
			>
			{
				props.data.map((el, index) =>{
					return(
						<div
							key={"r=" + index}
							name={"r=" + index}
							className="boardRow"
						>
						{
							el.map((el, index) => {
								return(
									<div
										key={"c=" + index}
										name={"c=" + index}
										className={"boardCell " + (el === 1 ? "live" : "dead")}
									>
									</div>
								)
							})
						}

						</div>
					)
				})
			}
		</div>
	);
}

class App extends Component {
  
	constructor(props) {
		super(props);

		this.state = {
			boardSize: {
				width: 20,
				height: 10,
			},
			boardData: {},
			iteratorCounter: 0,
		};
	}

	componentWillMount(){
		this.dataFirst();
	}

	componentDidMount(){
		this.iterator();
	}

	dataFirst = () =>{
		let boardData = [];
		let boardRows = [];
		const height = this.state.boardSize.height
		const width = this.state.boardSize.width;

		for (let h = 0; h < height; h++){
			for (let w = 0; w < width; w++){
				boardRows.push(
					//Math.floor(Math.random() * (1 - 0 + 1) + 0)
					0
				);
				if(w + 1 === width){
					boardData.push(boardRows);
					boardRows = [];
				}
			}
			if(h+1 === height){
				boardData[2][4] = 1; 
				boardData[3][5] = 1; 
				boardData[4][3] = 1; 
				boardData[4][4] = 1; 
				boardData[4][5] = 1; 

				this.setState({
					boardData,
					iteratorCounter: this.state.iteratorCounter+1,
				});
			}
		}
	}

	dataIterate = (data) => {
		let height = this.state.boardSize.height;
		let width = this.state.boardSize.width;
		let currentData = _.cloneDeep(this.state.boardData);
		let mirrorData = _.cloneDeep(currentData);
		for (let h = 0; h < height; h++){
			let above = h > 0 ? h-1 : height-1;
        	let below = h < height-1 ? h+1 : 0;
			for (let w = 0; w < width; w++){
				let totalNeighborCount = 0;
				let left =  w > 0 ? w-1 : width-1;
            	let right = w < width-1 ? w+1 : 0;

				let topLeftCell = currentData[above][left];
				let topRightCell = currentData[above][right];
				let topCenter = currentData[above][w];
				let middleLeft = currentData[h][left];
				let middleRight = currentData[h][right];
				let bottomLeftCell = currentData[below][left];
				let bottomRightCell = currentData[below][right];
				let bottomCenter = currentData[below][w];

				totalNeighborCount += topLeftCell; // top left
				totalNeighborCount += topCenter; // top center
				totalNeighborCount += topRightCell; // top right
				totalNeighborCount += middleLeft; // middle left
				totalNeighborCount += middleRight; // middle right
				totalNeighborCount += bottomLeftCell; // bottom left
				totalNeighborCount += bottomCenter; // bottom center
				totalNeighborCount += bottomRightCell; // bottom right

				if(currentData[h][w] === 0){
					switch(totalNeighborCount){
						case 3:
							mirrorData[h][w] = 1; //cell is dead but has 3 neighbours => cell alive
						break;
						default:
							mirrorData[h][w] = 0; // leave cell dead if its already dead and doesnt have 3 neighbours
					}
				}
				else if(currentData[h][w] === 1){
					switch(totalNeighborCount){
						case 2:
						case 3:
							mirrorData[h][w] = 1; // leave cell alive if neighbour count is >=2 or <=3
						break;
						default:
							mirrorData[h][w] = 0; //if cell is alive but if neighbour count is <= 1 or >=4 => cell dead
					}
				}
			}
			if(h+1 === height){
				let iteratorCounter = this.state.iteratorCounter;
				this.setState({
					boardData: mirrorData,
					iteratorCounter: iteratorCounter+1,
				});
				this.iterator();
			}
		}
	}

	iterator = () =>{
		let iteratorCounter = this.state.iteratorCounter;
		setTimeout(() => {
			if(iteratorCounter <= 500){
				if(iteratorCounter > 0){
					this.dataIterate();
				}		
			}
		}, 100);
	};

	render() {
		return (
		  <div className="App container">
		  	<h1 className="bg-primary title">Game Of Life with React</h1>
		  	<GameBoard 
				data={this.state.boardData}
				size={this.state.boardSize}
		  	/>
		  </div>
		);
	}
}

export default App;