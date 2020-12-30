/*
    keyup : 누르고 뗀순간
    keyDown : 누르는 순간
    keypress : 방향키는 인식이 안됨, 

    호출스택 : 함수가 호출되는게 나중에 호출되는게 먼저 나가는
     => 함수가 호출 ()될때 호출스택에 들어간다 생각하고
     끝날때 } 나간다 생각하자
    
     setTimeout(function{}) 등 비동기의 경우
     스택에 들어간다 호출시  그안의 함수는 그럼 언제 실행 되는 것인가?

    이벤트 루프
        호출 스택                                엔진
   1. setInterval(tickk,1000)                tick 2초마다
   2.                                        tick 2초마다
   => 엔진에서 바로 호출 스택으로 가지 않고 태스트 큐에 들어가서 대기한다
   그이유는  엔진에 많은 비동기이벤트들이 잇을수도 잇으니 순차적으로? 하기 위해
   엔진에서 태스트 큐로 가고 호출스택이 비워져 잇으면 이벤트 루프가 태스트 큐에서 호출스택으로 보낸다(tick을00)

   실제론 태스트 큐는 여러개다  엔진에서 콜백함수를 태스트큐에 넣어주는데 테스트 큐가 여러가 이기 때문에
   이때 이벤트 루프의 역활이 잇다
   https://hudi.kr/%EB%B9%84%EB%8F%99%EA%B8%B0%EC%A0%81-javascript-%EC%8B%B1%EA%B8%80%EC%8A%A4%EB%A0%88%EB%93%9C-%EA%B8%B0%EB%B0%98-js%EC%9D%98-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%B2%98%EB%A6%AC-%EB%B0%A9%EB%B2%95/

*/
var tetris = document.querySelector('#tetris');
var tetrisData = []
var currentTopLeft = [0,3] // 시작
var blocks = [
    {
        name:'s',// 네모
        center:false,
        numCode : 1,
        color : 'red',
        currentShapeIndex : 0,
        shape:[
            [
                [0, 0, 0],
                [0, 1, 1],
                [0, 1, 1],
            ]
        ]
    },
    {
        name:'t',
        center : true,
        numCode:2,
        color:'orange',
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0],
            ],
        ]
    },
    {
    name: 'z', // 지그재그
    center: true,
    numCode: 3,
    color: 'yellow',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ]
  },
  {
    name: 'zr', // 반대 지그재그
    center: true,
    numCode: 4,
    color: 'green',
    startRow: 1,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
    ]
  },
  {
    name: 'l', // L자
    center: true,
    numCode: 5,
    color: 'blue',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
    ]
  },
  {
    name: 'lr', // 반대 L자
    center: true,
    numCode: 6,
    color: 'navy',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ]
  },
  {
    name: 'b', // 1자
    center: true,
    numCode: 7,
    color: 'violet',
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
    ]
  },

];
var currentBlock;
var nextBlock;

const color = ['red','orange','yellow','green','blue','navy','violet'];

const isActiveBlock = value =>(value>0 && value <10)
const  isInvalidBlock  = value =>(value ===undefined || value >= 10)

function init(){
    const fragment = document.createDocumentFragment();
    [...Array(20).keys()].forEach((col, i) => {
        const tr = document.createElement('tr');
        fragment.appendChild(tr);
        [...Array(10).keys()].forEach((row,j)=>{
            const td = document.createElement('td')
            tr.appendChild(td);
        })
        const column = Array(10).fill(0);
        tetrisData.push(column)
        //console.log(tetrisData,'데이터 만들기')
    })
    // 이미 프레그먼트에 for으로 그려진 tr,td 가 담겨있는걸 추가하므로 화면은 한번만 그려진다.
    tetris.appendChild(fragment)
}
// 그리기[데이터와 화면 일치 시키기 ]
function draw(){
   // console.log('drawed', JSON.parse(JSON.stringify(tetrisData)), JSON.parse(JSON.stringify(currentBlock)));
    tetrisData.forEach((col,i)=>{
        col.forEach((row,j)=>{
            // 생성한 블록 은 0보다 큰 값이 들어가므로
            if(row >0){
                tetris.children[i].children[j].className = tetrisData[i][j] >=10 ?color[tetrisData[i][j] /10 -1] : color[tetrisData[i][j] -1]
                
            }else {
                tetris.children[i].children[j].className=''
            }
           
        })
    })

}
// 다음 블록을 그리는 함수
function drawNext(){
    const nextTable = document.getElementById('next-table')
    nextTable.querySelectorAll('tr').forEach((col,i)=>{
        // Array.from: 얇게 복사
        //console.log(Array.from(col.children),'Array.from(col.children)')
        Array.from(col.children).forEach((row,j)=>{
            // td의 칸이 있고 0보다 크다면
            if(nextBlock.shape[0][i] && nextBlock.shape[0][i][j]>0){
                // 해당 td를 색을 칠해라 칸!!을 for문으로 도는거 명심@
                nextTable.querySelectorAll('tr')[i].children[j].className = color[nextBlock.numCode -1]
            }else {
                tetris.children[i].children[j].className ='';
            }
            
        })
    })
}

// 테스트리스 블록 생성
function generate(){
    if(!currentBlock){
        currentBlock= blocks[Math.floor(Math.random()*blocks.length)];
    }else{
        currentBlock =nextBlock;
    }
    currentBlock.currentShapeIndex=0;
    nextBlock = blocks[Math.floor(Math.random()*blocks.length)]; // 다음 블록 미리 생성
    //console.log(currentBlock,'currentBlock')
    drawNext();
    // 시작 부분 -1 이여야 빈공간없이 첫줄부터 딱 붙게 나온다 [현재 블록의 모양 데이터가 인덱스 0이 빈칸이기 때문에]
    currentTopLeft=[-1,3];
    let isGameOver = false;
    /*
      만약 slice 전달 인자를 하나만 명시하면, 그 위치에서 배열 끝까지의 모든 원소를 포함하는 부분 배열을 반환
      console.log(currentBlock.shape[0].slice(1),'slice') => 예시로 ㅜ의 모양일때  3*3 검사지만 slice(1) 해줫기에 2*3의 모양으로 검사를 해사
      데이터가 있으면 색을 칠한다. 
      첫줄 빈 공간 빼고 모양만 
      게임오버 판탄  ! 잘모르겟음!
    */
      currentBlock.shape[0].slice(1).forEach((col,i)=>{
        // 줄
        col.forEach((row,j)=>{
            //console.log(tetrisData[i][j+3],'row && tetrisData[i][j+3]')
        //    if ( tetrisData[i][j+3] =0){
        //        console.log('포함?')
        //     tetrisData[i][j+3].className='red'
        //    }
        //    tetrisData[i][j+3].className='red'
            if(row && tetrisData[i][j+3]){
                //isGameOver = true
            }
        })
    });

    // 블록 데이터 생성
    currentBlock.shape[0].slice(1).forEach((col,i)=>{
        //(currentBlock.shape[0], currentBlock.shape[0].slice(1), col)
        col.forEach((row,j)=>{
            // +3이 시작할때의 위치
            if(row){
                tetrisData[i][j +3] = currentBlock.numCode;
            }
        })
    })
    //console.log(tetrisData,'tetrisData')
    //console.log('generate', JSON.parse(JSON.stringify(currentBlock)));
    if(isGameOver){
        clearInterval(int);
        draw();
    }else{
        draw();
    }
}

// 한칸 아래로
function tick(){

    //currentTopLeft[0]이 -1이므로 +1해준다
    const nextTopLeft = [currentTopLeft[0]+1 ,currentTopLeft[1]];
    const activeBlocks = [];
    // 기본적으로 내려간다구하구 못내려갈경우 바꾼다 
    let canGoDown =true;
    // 현재 내모양의 방향
    let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
    /*
            continue 문은 현재 또는 레이블이 지정된 루프의 현재 반복에서 명령문의 실행을 종료하고 반복문의 처음으로 돌아가여 루프문의 다음 코드를 실행합니다.
            let text = '';

            for (let i = 0; i < 10; i++) {
            if (i === 3) {
                continue;
            }
            text = text + i;
            }

            console.log(text);
            // expected output: "012456789"

        */
    // 아래 블럭이 있으면
    /*
      3*3으로 현재 위치를 검사하는데 바로 밑에 줄로 포함한 3*3과 비교해서 내려갈수 잇으면 내리구
      내릴수 없으면 그위치에 고정
    */
    for(let i =currentTopLeft[0]; i <currentTopLeft[0] + currentBlockShape.length; i++){
      
        if(i<0||i>=20) continue;
       //console.log( currentTopLeft[1],'')
        for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
          
           // console.log(tetrisData[i][j],'tetrisData[i][j]')
            // 현재 움직이는 블럭이면
          
            if(isActiveBlock(tetrisData[i][j])){
                activeBlocks.push([i, j]);

                if (isInvalidBlock(tetrisData[i + 1] && tetrisData[i + 1][j])) {
                    //console.log('아래 블럭이 있다!', i, j, tetrisData[i][j], tetrisData[i + 1] && tetrisData[i + 1][j], JSON.parse(JSON.stringify(tetrisData)));
                    canGoDown = false;
                }


            }
        }
    } // q반복문을 한번 돌려서 canGoDown r값을 설정해준다 더이상 내려갈수 없으면 

    if(!canGoDown){
        // 더이상 움직일수 없으면 고정 블럭으로 만들어준다.
        activeBlocks.forEach((blocks)=>{
            console.log(blocks,'이것은 blocks')
            tetrisData[blocks[0]][blocks[1]] *= 10;
        })
        checkRow();
        generate();
        return false;
    }else if(canGoDown){
      
        /*
          tetrisData : 표 안에 데이터 
          한번 다시 돈다 밑에 부터 돌아야 하기때문에 
        */
        for (let i = tetrisData.length - 1; i >= 0; i--) {
            const col = tetrisData[i];
            col.forEach((row, j) => {
              if (row < 10 && tetrisData[i + 1] && tetrisData[i + 1][j] < 10) {
                tetrisData[i + 1][j] = row;
                tetrisData[i][j] = 0;
              }
            });
          }
          currentTopLeft = nextTopLeft;
          draw();
          return true;
          
    }


}
/*
  다 차잇는지 검사
  데이터가 없으면 그냥 지나가구 데이터 잇을때만 검사 
  그리고 한줄이 다 채워져 잇으면 그줄을 제외하구 
  인덱스 0 에 한줄을 추가하므로 한줄이 없어진 것처럼 보이게 한다.
  */
function checkRow(){
  const fullRows = [];
  tetrisData.forEach((col,i)=>{
    let count =0; 
    col.forEach((row,i)=>{
      if(row>0) count++
    })
    if(count === 10) {
      fullRow.push(i)
    }
  })

  // 꽉찬 줄이 몇개인지 
    const fullRowsCount = fullRows.length;
    tetrisData = tetrisData.filter((row, i) => !fullRows.includes(i));
    for (let i = 0; i < fullRowsCount; i++) {
        tetrisData.unshift([0,0,0,0,0,0,0,0,0,0]);
    }
    console.log(fullRows, JSON.parse(JSON.stringify(tetrisData)));
    let score = parseInt(document.getElementById('score').textContent, 10);
    score += fullRowsCount ** 2;
    document.getElementById('score').textContent = String(score);

}



  
let int = setInterval(tick, 200);
init();
generate();
// setInterval(tick, 2000)


document.getElementById('stop').addEventListener('click', function() {
  clearInterval(int);
});
document.getElementById('start').addEventListener('click', function() {
  if (int) {
    clearInterval(int);
  }
  int = setInterval(tick, 500);
});

// 이벤트
window.addEventListener('keydown',e=>{
  switch(e.code){
    case 'ArrowLeft': { // 키보드 왼쪽 클릭 = 좌측 한 칸 이동
      break;
    }
    case 'ArrowRight': { // 키보드 오른쪽 클릭 = 우측 한 칸 이동
    }
    case 'ArrowDown': { // 키보드 아래쪽 클릭 = 하방측 한 칸 이동
      tick();
    }
  }
})

// 방향 전환
window.addEventListener('keyup',(e)=>{
  switch(e.code){
      case 'ArrowUp': { // 방향 전환
          console.log('방향 전환')
          let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
          let isChangeble = true;

          // 다음 인덱스 4이상이면 다시 초기화 0 모양으로 돌아오고 아니면 그다음 모양
          const nextShapeIndex = currentBlock.currentShapeIndex + 1 === currentBlock.shape.length ? 0 : currentBlock.currentShapeIndex + 1;
          const nextBlockShape = currentBlock.shape[nextShapeIndex]


          console.log(nextBlockShape, '  nextBlockShape')  // 배열 다음 모양 배열
          //console.log(  nextBlockShape[0],'  nextBlockShape')

          // 모양의 크기대루 검사해서 블록이 잇는지 확인해야하니깐 currentBlockShape.length 만큼 검사 한다
          for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) {
              /*
                currentTopLeft[1] 현재 위치의 모양 가로 줄 시작
                currentTopLeft[0] 현재 위치의 모양 세로줄 시작
              */

              console.log(nextBlockShape[currentTopLeft[0]], '  nextBlockShape ㅑ')

              if (!isChangeble) break;
              for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
                  // 데이터가 없을땐 지나가구
                  if (!tetrisData[i]) continue;
                  console.log(nextBlockShape[i - currentTopLeft[0]], i, currentTopLeft[0], ' nextBlockShape[i-currentTopLeft[0]]')
                  // 이해 안간다.
                  if (nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]] && isInvalidBlock(tetrisData[i] && tetrisData[i][j])) {
                      console.log(i, j)
                      isChangeble = false
                  }

              }

              if (isChangeable) {
                  console.log('isChangeable', JSON.parse(JSON.stringify(currentBlock)), nextBlockShape);
                  while (currentTopLeft[0] < 0) {
                      tick();
                  }
                  for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 돌린 이후 공간 체크
                      for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
                          if (!tetrisData[i]) continue;
                          let nextBlockShapeCell = nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]];
                          if (nextBlockShapeCell > 0 && tetrisData[i][j] === 0) {
                              // 다음 모양은 있는데 현재 칸이 없으면
                              tetrisData[i][j] = currentBlock.numCode;
                          } else if (nextBlockShapeCell === 0 && tetrisData[i][j] && tetrisData[i][j] < 10) {
                              // 다음 모양은 없는데  현재 칸이 있으면
                              tetrisData[i][j] = 0;
                          }
                      }
                  }
                  currentBlock.currentShapeIndex = nextShapeIndex;
              }
              draw();
              break;
          }

      }

    case 'Space': // 한방에 쭉 떨구기
        while (tick()) {}
        break;
    }
})

// shape:[
//   [
//       [0, 0, 0],
//       [0, 1, 1],
//       [0, 1, 1],
//   ]
// ]