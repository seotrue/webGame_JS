/*
    1. 카드를 돔에 그려준다
    2. 클릭시 뒤집히는 클래스를 토글한다
    3. 카드색 부여하기  =>  카드 뒷면에 각자 다른 색을 넣어준다 
    (concat 은 두 개의 문자열을 하나의 문자열로 만들어주는 역활을 하는 함수이며, 입력값을 문자열 대신 배열을 사용하면 두 개의 배열을 하나의 배열로 만들어주는 역활도 하는 함수입니다.)
    4. 유저가 카드를 외울 시간을 준다
    5. 외울시간 일때는 클릭을 못하도록 clickFlog
    6. 카드 두개 맞추기(맞으면 안닫히고 틀리면 닫힌다) => 2개 틀릭시 색 비교
    7. 이미 맞춘 카드는 클릭을 못하도록 => 따로 배열로 담아서 includes() 사용
    8. 맞춘카드 갯수로 다 맞추면 현재시간과 문구 반환 그리고 초기화
    9. 그리고 카드 섞어서 다시 새로운 게임 시작


    [참조와 복사 관계]
    -. 배열도 객체이기 때문에 =을 사용하면 참조 관계로 인식 => 참조관계를 끊는 방법 : .slice()사용
    -. 원시값(문자, 숫자, 블린)은 대입으로 복사 할수 있다
    ex)
    var a = '진솔';
    var b = a;
    b //진솔
    b ='길동'
    b // 길동
    a  // 진솔
    => 원시값을때는 a 와 b 의 값은 따로따로 움직인다. => 복사(깊은복사)

    // 객체(객체 배열 함수) => 참조(얕은복사)
    var a = {'사람': '진솔'}
    var b = a;
    b //{'사람': '진솔'}
    b[사람] ='길동'
    b // {'사람': '길동'}
    a  //  {'사람': '길동'}
    => 객체일경우에는 a 와 b의 값이 같이 바뀐다 복사가 아닌 참고관계!

    -. 객체 복사하는 방법
    값인 똑같이 하되 값두 따로따로 같고 싶다면
    방법1. 객체의 값중 원시값을 대입한다 =>obj ={a:1}; obj2.a =1; 하나씩 원시값 넣어주기
    방법2. 중요!
    var obj = {a:1,b:2,c:3}
    var obj2 = {}
    Object.keys(obj).forEach(function(key){ // 객체의 속성명을 배열로 바꿔줌 => forEach로 넣어준다.
        obj2[key] = obj[key]
    }) 

    or

    Object.assign({})
    => 단점은 계층구조의 객체일 경우  계층 구조부분들은 참조가 된다.

    -. 객체는 모양이 같아두 비교하면 다르다 false 값 
    -. 객체의 참조 관계의 비교는 true
    var a = {'사람': '진솔'}
    var b = a;

    b === a // true => 참조관계이기 때문에

    var obj = {a:1,b:2,c:3}
    var obj2 = {a:1,b:2,c:3}

    obj === obj2 // false => 객체는 모양이 같아두 비교하면 다르다 false 값 


    -. 깊은복사
    계층구조의 객체일 경우의 방법
    1.
    function copyObj(obj) {
        var copy = {};
        if (Array.isArray(obj)) {
            copy = obj.slice().map((v) => {
            return copyObj(v);
            });
        } else if (typeof obj === 'object' && obj !== null) {
            for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = copyObj(obj[attr]);
            }
            }
        } else {
            copy = obj;
        }
        return copy;
    }
    => 재귀함수를 이용 

    2. 성능 최악.. 하지만 주로 쓰임
    obj2 = JSON.pasrse(JSON.stringfy(복사하고 싶은 객체))


    [프로토타입과 팩토리패턴]
    var 프로토타입 = {
        적용할 객체의 공통사항
    } => 한방에 수정하고 , 한방에 추가하구 , 한방에 삭제하기 때문에
    var card = Object.create(프로토타입)

    //  Object.create와 생성자 함수의 차이 체크!
    


 */

var 가로 = 4;
var 세로 = 3;
var 색깔들 = ['red', 'red', 'orange', 'orange', 'green', 'green', 'yellow', 'yellow', 'white', 'white', 'pink', 'pink'];
var 색깔후보 = 색깔들.slice();
var 색깔 = [];
var 클릭플래그 = true;
var 클릭카드 = [];
var 완성카드 = [];
var 시작시간;
function 셔플() { // 피셔예이츠 셔플
    for (var i = 0; 색깔후보.length > 0; i += 1) {
        색깔 = 색깔.concat(색깔후보.splice(Math.floor(Math.random() * 색깔후보.length), 1));
    }
}

function 카드세팅(가로, 세로) {
    클릭플래그 = false;
    for (var i = 0; i < 가로 * 세로; i += 1) {
        var card = document.createElement('div');
        card.className = 'card';
        var cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        var cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        var cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.style.backgroundColor = 색깔[i];
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        (function (c) { // 클로저 문제 해결
            card.addEventListener('click', function() {
                if (클릭플래그 && !완성카드.includes(c)) {
                    c.classList.toggle('flipped');
                    클릭카드.push(c);
                    if (클릭카드.length === 2) {
                        if (클릭카드[0].querySelector('.card-back').style.backgroundColor === 클릭카드[1].querySelector('.card-back').style.backgroundColor) {
                            완성카드.push(클릭카드[0]);
                            완성카드.push(클릭카드[1]);
                            클릭카드 = [];
                            if (완성카드.length === 12) {
                                var 끝시간 = new Date();
                                alert('축하합니다! 성공! ' + (끝시간 - 시작시간) / 1000 + '초 걸렸습니다.');
                                document.querySelector('#wrapper').innerHTML = '';
                                색깔후보 = 색깔들.slice();
                                색깔 = [];
                                완성카드 = [];
                                시작시간 = null;
                                셔플();
                                카드세팅(가로, 세로);
                            }
                        } else { // 두 카드의 색깔이 다르면
                            클릭플래그 = false;
                            setTimeout(function() {
                                클릭카드[0].classList.remove('flipped');
                                클릭카드[1].classList.remove('flipped');
                                클릭플래그 = true;
                                클릭카드 = [];
                            }, 1000);
                        }
                    }
                }
            });
        })(card);
        document.querySelector('#wrapper').appendChild(card);
    }

    document.querySelectorAll('.card').forEach(function (card, index) { // 초반 카드 공개
        setTimeout(function() {
            card.classList.add('flipped');
        }, 1000 + 100 * index);
    });

    setTimeout(function() { // 카드 감추기
        document.querySelectorAll('.card').forEach(function (card) {
            card.classList.remove('flipped');
        });
        클릭플래그 = true;
        시작시간 = new Date();
    }, 5000);
}

셔플();
카드세팅(가로, 세로);