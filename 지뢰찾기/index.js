var tbody = document.querySelector('#table tbody');
vat dataset = [];
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
                e.currentTarget.textContent = '!';
                this.dataset[row][cell] = '!'
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

