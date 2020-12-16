/*
    1. 화면 그리기
    2. 지뢰심기
    3. 우클릭 시 깃발(!) 꼽기
    4. 우클릭 2번일 경우 물음표 기능
    5. 주변 지뢰 갯수 세기
    6. 클릭시 지뢰가 아니면 주변칸과 같이 열기

    [스코프, 클로저, 재귀함수] 개념 정리
    -. 클로저의 경우 비동기함수의 변수는 실행될때 값이 결정되는 것으로 콘설이 실행될때는 i값을 찾을땐 이미 for문이 다 돈 후여서
    해결방법의 경우는 즉시실행 함수의 매개변수로 변수의 값을 받는다.
    -. 재귀함수는 함수안에서 자신의 함수를 부를때를 말한다.(조건이 필요함 멈추기위해서)
    -.
*/

var tbody = document.querySelector('#table tbody');
var dataset = [];
var 코드표 ={
    연칸:-1,
    물음표:-2,
    깃발:-3,
    깃발지뢰:-4,
    물음표지뢰:-5,
    지뢰:1,
    보통칸:0

}
document.querySelector('#exec').addEventListener('click',function(){
    var hor =parseInt(document.querySelector('#hor').value);
    var ver =parseInt(document.querySelector('#ver').value);
    var mine =parseInt(document.querySelector('#mine').value);

    // 지뢰 위치뽑기
    var a =  Array(hor*ver).fill().map((v,i)=>{
        return i
    })

   
    var suffle =[];
    while(a.length>80){
        var move = a.splice(Math.floor(Math.random() * a.length),1)[0]
        suffle.push(move)
    }
    console.log(suffle)


    
    for(var i=0; i<ver; i++){
        var arr =[];
        var tr = document.createElement('tr');
        dataset.push(arr)
        for(var j=0; j<hor; j++){
            arr.push(1);
            var td = document.createElement('td');
            // td를 만들자 마자 이벤트 리스너를 붙여주기
            td.addEventListener('contextmenu',function(e){
                e.preventDefault();
                console.log(e.currentTarget,'내가 클릭한 td');
                //e.currentTarget : 이벤트 리스너가 달린애
                //e.target : 실제 이벤트가 발생한 애
                // 몇번째 줄 몇번째 칸인지 파악
                var 부모tr = e.currentTarget.parentNode;
                var 부모tbody = e.currentTarget.parentNode.parentNode;
                var 칸 = Array.prototype.indexOf.call(부모tr.children,e.currentTarget);
                var 줄 = Array.prototype.indexOf.call(부모tbody.children,부모tr);
                console.log(칸,'내가 클릭한 칸');
                e.currentTarget.textContent = '!';
                this.dataset[줄][칸] = '!'
                
                // 이미 연칸 클릭해두 반응없게
                if(this.dataset[줄][칸] ==='!'){
                    console.log('??s')
                }
                
            })
            
            td.addEventListener('click',function(e){
                var 부모tr = e.currentTarget.parentNode;
                var 부모tbody = e.currentTarget.parentNode.parentNode;
                var 칸 = Array.prototype.indexOf.call(부모tr.children, e.currentTarget);
                var 줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr);
            
            
            })
            
            tr.append(td)
            td.textContent=1;
        }
        tbody.append(tr)
    }
    console.log(dataset)

    for(var k=0; k<suffle.length; k++){ // 예) 56
        var row = Math.floor(suffle[k]/10) //예)5>4
        var cell = suffle[k] % 10 //예 6>6
        tbody.children[row].children[cell].textContent = 'X'
        dataset[row][cell] = 'X'
    }
})

