
const main = () => {
    let rows = [];
    let history = [];
    let timeInterval = 0;
    let currentTurn = null;
    let size = 0;
    var startingColor = null;
    let winBlack = 0;
    let winWhite = 0;
    
    const scoreBoard = document.getElementById("score-board");
    // current turn
    const currentTurnShower = document.createElement('div');
    currentTurnShower.className = 'current-turn-shower';
    currentTurnShower.textContent = 'current turn: '+ startingColor;
    scoreBoard.insertBefore(currentTurnShower, scoreBoard.lastElementChild);
    // winner history
    const winnerHistory = document.createElement('div');
    winnerHistory.className = 'current-turn-shower';
    winnerHistory.textContent = 'black: '+ winBlack + "   white: "+ winWhite;
    scoreBoard.insertBefore(winnerHistory, scoreBoard.lastElementChild);

    const initForm = () => {
        const formDom = document.getElementById('map-initializer-form');

        formDom.addEventListener('submit' , function (e) {
            e.preventDefault();
            size = formDom.querySelector('[name="width"]').value;
            if (size < 10 || size > 20){
                alert("Size of the game board 'w' should be 10 <= w <= 19");
                return 0;
            }

            newGame();
            
            const btnDom = document.getElementById("restart-button");
            btnDom.addEventListener('click', function(){
                newGame();
            })
        })
    }


    const newGame = () => {
        timeInterval = showTime(timeInterval);
        
        rows = createMap();

        setInterval(function(){
            if (startingColor !== null){
                startGame(startingColor);
                startingColor = null;
            }
        }, 10);

    }


    const showTime = (timeInterval) => {
        clearInterval(timeInterval);
        const start = new Date().getTime();
        const timeDom = document.getElementById('time-elapsed');
        timeInterval = setInterval(function(){
            let time = parseInt(new Date().getTime()/1000) - parseInt(start/1000)
            let h = `${parseInt(parseInt(parseInt(time/60)/60)%24)}`;
            let m = `${parseInt(parseInt(time/60)%60)}`;
            let s = `${parseInt(time%60)}`;
            if (h.length < 2){
                h = "0"+h;
            }
            if (m.length < 2){
                m = "0"+m;
            }
            if (s.length < 2){
                s = "0"+s;
            }
            timeDom.textContent = `${h}:${m}:${s}`;
        }, 10);
        return timeInterval;
    }


    const stoneColorSelction = () => {
        const mapDom = document.getElementById('map');
        const stoneSelection = document.createElement('div');
        stoneSelection.className = 'stone-selection';
        const stoneSelectionText = document.createElement('div');
        stoneSelectionText.id = 'stone-selection-text';
        stoneSelectionText.textContent = 'Select the starting stone color :';

        const blackSelection = document.createElement('button');
        blackSelection.className = 'stone-selection-btn';
        blackSelection.textContent = 'Black';
        const whiteSelection = document.createElement('button');
        whiteSelection.className = 'stone-selection-btn';
        whiteSelection.textContent = 'White';

        stoneSelection.appendChild(stoneSelectionText);
        stoneSelection.appendChild(blackSelection);
        stoneSelection.appendChild(whiteSelection);
        mapDom.appendChild(stoneSelection);

        mapDom.addEventListener('click', function(){
            setInterval(() => {
                if(stoneSelection.classList.contains('red-background')){
                    stoneSelection.classList.remove('red-background');
                }else{            
                    stoneSelection.classList.add('red-background');
                }
            }, 200);
        }, {once : true})
        blackSelection.addEventListener('click', function(){
            stoneSelection.innerHTML = '';
            stoneSelection.className = 'removed';
            startingColor = 'black';
        })
        whiteSelection.addEventListener('click', function(){
            stoneSelection.innerHTML = '';
            stoneSelection.className = 'removed';
            startingColor = 'white';
        })
    }

    
    const createMap = () => {
        const _cells = [
        ]
        const mapDom = document.getElementById('map');
        mapDom.innerHTML = '';
        stoneColorSelction();

        for (let i = 0; i <size; i++) {
            const row = [];
            const rowDom = document.createElement('div');
            rowDom.className = 'row';
            for (let j = 0; j <size; j++) {
                const cellDom = document.createElement('div');
                cellDom.className = 'cell';
                // cellDom.textContent = `${i}${j}`;
                rowDom.appendChild(cellDom);
                const cell = {
                    x: j,
                    y: i,
                    dom: cellDom,
                    stone: null,
                }
                mapDom.appendChild(rowDom);
                row.push(cell);
            }
            _cells.push(row);
        }
        return _cells;
    }


    const notDoubleThree = (cell, currentTurn) => {
        const c = currentTurn;
        let directionMap = [[1, -1],[1, 0],[1, 1],[0, 1],
                                [-1, 1],[-1, 0],[-1, -1],[0, -1]];
        var numThree = 0;
        for (k = 0; k < 4; k++) {
            num = 0;
            sameDirection = false;
            for (j = 0; j < 2; j++) {
                for (i = 1; i < 4; i++) {
                    let x2 = cell.x + directionMap[k + 4 * j][0] * i;
                    let y2 = cell.y + directionMap[k + 4 * j][1] * i;
                    if (x2 < parseInt(size) && y2 < parseInt(size)
                        && 0 < x2+1 && 0 < y2+1) {
                        if (rows[y2][x2].stone == c) {
                            num ++;
                            console.log("요기 : ", k, j, i)
                        }else { break; }
                    } else { break; }
                }
                if (num == 2 && !sameDirection){
                    numThree++;
                    console.log(k, j, "두개연속발견");
                    sameDirection = true;

                }else if (num == 4 && sameDirection){
                    numThree --;
                    console.log(k, j, "이어진쌍삼")
                }
            }
            if (numThree > 1){
                console.log("쌍삼");
                numThree = 0;
                return false;
            }
        }
        numThree = 0;
        return true;
    }


    const startGame = (turn) => {
        currentTurnShower.textContent = 'current turn: '+ turn;
        let colorDict = {'white': 'black', 'black':'white'};
        currentTurn = turn;
        rows.forEach(row => {
            row.forEach(cell => {
                cell.dom.addEventListener('click', function(){
                    if (cell.dom.textContent === '' && notDoubleThree(cell, currentTurn)){
                        cell.stone = currentTurn;
                        if (currentTurn === 'black') {
                            cell.dom.textContent = '●';
                            currentTurn = 'white';
                            history.push(cell);
                        } else {
                            cell.dom.textContent = '○';
                            currentTurn = 'black';
                            history.push(cell);
                        }
                    }else if(cell.dom.textContent !== '' && cell === history[history.length -1]){
                        cell.dom.textContent = '';
                        cell.stone = null;
                        currentTurn = colorDict[currentTurn];
                        history.pop();
                    }

                    currentTurnShower.textContent = 'current turn: '+ currentTurn;
                    if(checkGameEnd(cell)) {
                        gameEnd(cell.stone);
                    }
                })
            })
        });
    }

    
    const checkGameEnd = (cell) => {
        if (cell.stone === null){
            return false;
        }
        const c = cell.stone;
        let directionMap = [[1, -1],[1, 0],[1, 1],[0, 1],
                                [-1, 1],[-1, 0],[-1, -1],[0, -1]];
        for (k = 0; k < 4; k++) {
            num = 1;
            for (j = 0; j < 2; j++) {
                for (i = 1; i < 5; i++) {
                    let x2 = cell.x + directionMap[k + 4 * j][0] * i;
                    let y2 = cell.y + directionMap[k + 4 * j][1] * i;
                    if (x2 < parseInt(size) && y2 < parseInt(size)
                        && 0 < x2+1 && 0 < y2+1) {
                        if (rows[y2][x2].stone == c) {
                            num ++;
                        }else { break; }
                    } else { break; }
                }
            }
            if (num >= 5){ return true; }
        }
        return false;
    }


    const gameEnd = (stoneColor) => {
        // 게임 종료 처리.
        const mapDom = document.getElementById('map');
        mapDom.innerHTML = '';
        const resultDom = document.createElement('div');
        resultDom.id = 'result';
        resultDom.textContent = `${stoneColor} color win !`;
        mapDom.appendChild(resultDom);
        if (stoneColor == 'black'){
            winBlack ++;
        }else{
            winWhite ++;
        }
        winnerHistory.textContent = 'black: '+ winBlack + "   white: "+ winWhite;
    }

    initForm();
}

main();