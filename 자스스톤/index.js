/*
    개발 순서
    1. 상대 카드 내카드 내영웅 상대영웅 덱 코스트 화면 그리기
    2. 초기셋팅 함수를 만든다. => 기능 나눌때 편할려구 함수로 하는거지 딱히 이유는 없음
    3. 자주 쓰는 div 친구들을 변수로 선언
    4. 카드공장 함수 만들기 => 생성자패턴을 사용해서 , 공격력 체력 렌덤으로 생성
    5. 가상 데이터 저장해줄 배열 만들고  카드 공장에서 뽑은 애들을 각각 맞게 배치 후 초기 셋팅 끝

    6. 쫄병카드 코스트에 맞춰 뽑기
    7. 필드카드 선택과 턴오버 (필드 안 카드 선택하면 공격된다) 
*/
/*
    
    cloneNode와 생성자 활용
    cloneNode로 기존 태그를그대로 복사 가능,인자에 true를 넣으면 내부까지 복사 가능
    ex) var clone = document.querySelelctor('복사할 태그').cloneNode(true)
    

    return => return 은 값을 반환한다는 의미로 쓰이지만 exit의 의미로도 자주 쓰인다. https://skql.tistory.com/102
    function 함수(){
        if(){
            return // => 리턴만 잇다면 if문을 감싸구 있는 함수를 종료 시킨다.
        }

        if(){
            return true // =>if문을 감싸구 있는 함수를 종료시키면서 리턴값으로 true를 반환한다.
        }
    }

    //4. 카드공장을 실행할때마다 카드 생성자 함수가 안에 잇으면 계속 선언 되니깐카드공장 밖으로 선언 부분을 꺼낸다.
    function Card (){

    }
    function 카드공장(){
        return new Card(); //=> 입력값을 매개변수로 딱히 받지 않는다면 리턴 값으로 바로 생성자함수를 줘도 된다
    }
*/

var 상대 = {
    영웅: document.getElementById('rival-hero'),
    덱: document.getElementById('rival-deck'),
    필드: document.getElementById('rival-cards'),
    코스트: document.getElementById('rival-cost'),
    덱data: [],
    영웅data: [],
    필드data: [],
    선택카드: null,
    선택카드data: null,
};

var 나 = {
    영웅: document.getElementById('my-hero'),
    덱: document.getElementById('my-deck'),
    필드: document.getElementById('my-cards'),
    코스트: document.getElementById('my-cost'),
    덱data: [],
    영웅data: [],
    필드data: [],
    선택카드: null,
    선택카드data: null,
};
var 턴버튼 = document.getElementById('turn-btn');
var 턴 = true; // true면 내턴, false면 니턴

function 덱에서필드로(데이터, 내턴) {
    var 객체 = 내턴 ? 나 : 상대; // 조건 ? 참 : 거짓;
    var 현재코스트 = Number(객체.코스트.textContent);
    if (현재코스트 < 데이터.cost) {
        return 'end';
    }
    var idx = 객체.덱data.indexOf(데이터);
    객체.덱data.splice(idx, 1);
    객체.필드data.push(데이터);
    필드다시그리기(객체);
    덱다시그리기(객체);
    데이터.field = true;
    객체.코스트.textContent = 현재코스트 - 데이터.cost;
}

function 필드다시그리기(객체) {
    객체.필드.innerHTML = '';
    객체.필드data.forEach(function(data) {
        카드돔연결(data, 객체.필드);
    });
}
function 덱다시그리기(객체) {
    객체.덱.innerHTML = '';
    객체.덱data.forEach(function(data) {
        카드돔연결(data, 객체.덱);
    });
}
function 영웅다시그리기(객체) {
    객체.영웅.innerHTML = '';
    카드돔연결(객체.영웅data, 객체.영웅, true);
}

function 화면다시그리기(내화면) {
    var 객체 = 내화면 ? 나 : 상대; // 조건 ? 참 : 거짓;
    필드다시그리기(객체);
    덱다시그리기(객체);
    영웅다시그리기(객체);
}

function 턴액션수행(카드, 데이터, 내턴) {
    // 턴이 끝난 카드면 아무일도 일어나지 않음
    var 아군 = 내턴 ? 나 : 상대;
    var 적군 = 내턴 ? 상대 : 나;
    if (카드.classList.contains('card-turnover')) {
        return;
    }
    // 적군 카드면서 아군 카드가 선택되어 있고, 또 그게 턴이 끝난 카드가 아니면 공격
    var 적군카드 = 내턴 ? !데이터.mine : 데이터.mine;
    if (적군카드 && 아군.선택카드) {
        데이터.hp = 데이터.hp - 아군.선택카드data.att;
        if (데이터.hp <= 0) { // 카드가 죽었을 때
            var 인덱스 = 적군.필드data.indexOf(데이터);
            if (인덱스 > -1 ) { // 쫄병이 죽었을 때
                적군.필드data.splice(인덱스, 1);
            } else { // 영웅이 죽었을 때
                alert('승리하셨습니다!');
                초기세팅();
            }
        }
        화면다시그리기(!내턴);
        아군.선택카드.classList.remove('card-selected');
        아군.선택카드.classList.add('card-turnover');
        아군.선택카드 = null;
        아군.선택카드data = null;
        return;
    } else if (적군카드) { // 상대 카드면
        return;
    }
    if (데이터.field) { // 카드가 필드에 있으면
        //  영웅 부모와 필드카드의 부모가 다르기때문에 document에서 모든 .card를 검색한다
        // 카드.parentNode.querySelectorAll('.card').forEach(function (card) {
        document.querySelectorAll('.card').forEach(function (card) {
            card.classList.remove('card-selected');
        });
        카드.classList.add('card-selected');
        아군.선택카드 = 카드;
        아군.선택카드data = 데이터;
    } else { // 덱이 있으면
        if (덱에서필드로(데이터, 내턴) !== 'end') {
            내턴 ? 내덱생성(1) : 상대덱생성(1);
        }
    }
}

function 카드돔연결(데이터, 돔, 영웅) {
    var 카드 = document.querySelector('.card-hidden .card').cloneNode(true);
    카드.querySelector('.card-cost').textContent = 데이터.cost;
    카드.querySelector('.card-att').textContent = 데이터.att;
    카드.querySelector('.card-hp').textContent = 데이터.hp;
    if (영웅) {
        카드.querySelector('.card-cost').style.display = 'none';
        var 이름 = document.createElement('div');
        이름.textContent = '영웅';
        카드.appendChild(이름)
    }
    카드.addEventListener('click', function() {
        턴액션수행(카드, 데이터, 턴);
    });
    돔.appendChild(카드);
}
function 상대덱생성(개수) {
    for (var i = 0; i < 개수; i++) {
        상대.덱data.push(카드공장());
    }
    덱다시그리기(상대);
}
function 내덱생성(개수) {
    for (var i = 0; i < 개수; i++) {
        나.덱data.push(카드공장(false, true));
    }
    덱다시그리기(나);
}
function 내영웅생성() {
    나.영웅data = 카드공장(true, true);
    카드돔연결(나.영웅data, 나.영웅, true);
}
function 상대영웅생성() {
    상대.영웅data = 카드공장(true);
    카드돔연결(상대.영웅data, 상대.영웅, true);
}

function Card(영웅, 내카드) {
    if (영웅) {
        this.att = Math.ceil(Math.random() * 2);
        this.hp = Math.ceil(Math.random() * 5) + 25;
        this.hero = true;
        this.field = true;
    } else {
        this.att = Math.ceil(Math.random() * 5);
        this.hp = Math.ceil(Math.random() * 5);
        this.cost = Math.floor((this.att + this.hp) / 2);
    }
    if (내카드) {
        this.mine = true;
    }
}
function 카드공장(영웅, 내카드) {
    return new Card(영웅, 내카드);
}

function 초기세팅() {
    [상대, 나].forEach(function (item) {
        item.덱data = [];
        item.영웅data = [];
        item.필드data = [];
        item.선택카드 = [];
        item.선택카드data = [];
    });
    상대덱생성(5);
    내덱생성(5);
    내영웅생성();
    상대영웅생성();
    화면다시그리기(true); // 상대화면
    화면다시그리기(false); // 내화면
}

턴버튼.addEventListener('click', function() {
    var 객체 = 턴 ? 나 : 상대;
    document.getElementById('rival').classList.toggle('turn');
    document.getElementById('my').classList.toggle('turn');
    필드다시그리기(객체);
    영웅다시그리기(객체);
    턴 = !턴; // 턴을 넘기는 코드
    if (턴) {
        나.코스트.textContent = 10;
    } else {
        상대.코스트.textContent = 10;
    }
});

초기세팅(); // 진입점

