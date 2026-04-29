/**
 * 곤이 디톡스 핵심 스크립트
 */

// [1] 요소 선택 및 변수 설정
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('detox-overlay');
const bgm = document.getElementById('bgm'); // 무한 반복 음성 (my_love.mp3)
const endBgm = new Audio('my_love2.mp3'); // 종료 음성
const textTop = document.getElementById('text-top');
const textBottom = document.getElementById('text-bottom');
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
const gonyImg = document.getElementById('gony-img');

let isDetoxMode = false;
let lastMousePos = { x: 0, y: 0 };
let hearts = [];
let mouseTimer;

// [2] 타자기 효과 함수
function typeWriter(element, text, speed = 100) {
    element.innerHTML = "";
    let i = 0;
    return new Promise(resolve => {
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
}

// [3] 하트 파티클 로직
function createHeart() {
    // 곤이 이미지 중앙 근처에서 하트 생성
    hearts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        size: Math.random() * 20 + 15,
        speedX: (Math.random() - 0.5) * 8,
        speedY: (Math.random() - 1) * 8, // 위로 솟구치게
        opacity: 1
    });
}

function animateHearts() {
    if (!isDetoxMode && hearts.length === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((h, i) => {
        h.x += h.speedX;
        h.y += h.speedY;
        h.opacity -= 0.015;
        
        ctx.font = `${h.size}px Arial`;
        ctx.fillStyle = `rgba(255, 105, 180, ${h.opacity})`;
        ctx.fillText("💖", h.x, h.y);
        
        if (h.opacity <= 0) hearts.splice(i, 1);
    });
    requestAnimationFrame(animateHearts);
}

// [4] 마우스 움직임 감지 이벤트
window.addEventListener('mousemove', (e) => {
    if (!isDetoxMode) return;

    // 마우스가 실제로 이동했는지 확인
    if (e.clientX !== lastMousePos.x || e.clientY !== lastMousePos.y) {
        // 1. 음성 무한 반복 시작 (my_love.mp3)
        if (bgm.paused) {
            bgm.play().catch(err => console.log("음원 재생을 위해 화면을 클릭해주세요."));
        }
        
        // 2. 하트 생성 및 곤이 애니메이션
        createHeart();
        gonyImg.style.transform = `scale(${1.1 + Math.random() * 0.1}) rotate(${(Math.random()-0.5)*10}deg)`;
    }
    
    lastMousePos = { x: e.clientX, y: e.clientY };

    // 3. 마우스를 멈추면 0.5초 뒤 소리 정지
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
        bgm.pause();
        bgm.currentTime = 0;
        gonyImg.style.transform = `scale(1) rotate(0deg)`;
    }, 500);
});

// [5] 메인 프로세스 실행
startBtn.onclick = () => {
    const workInput = document.getElementById('work-time').value;
    const restInput = document.getElementById('rest-time').value;
    
    const workTime = parseFloat(workInput) * 1000 * 60;
    const restTime = parseFloat(restInput) * 1000 * 60;

    // 대기 시작 (최소화 기능은 일렉트론 메인 프로세스에서 다뤄야 함)
    alert(`${workInput}분 뒤에 곤이가 찾아올게! (찡긋)`);
    
    setTimeout(async () => {
        // 디톡스 모드 진입
        isDetoxMode = true;
        overlay.classList.remove('hidden');
        overlay.classList.remove('fade-out');
        
        // 캔버스 크기 조절
        canvas.width = 450;
        canvas.height = 450;
        animateHearts();

        // 시작 멘트 타이핑
        await typeWriter(textTop, "곤듀들의 눈건강을 위해 곤이가 왔어");
        await typeWriter(textBottom, "곤듀들이 쉬지 않으면 무한 내 사랑 반복이야~~(찡긋)");

        // 휴식 시간 카운트다운 시작
        setTimeout(async () => {
            // 디톡스 모드 종료 시퀀스
            isDetoxMode = false;
            bgm.pause(); 
            bgm.currentTime = 0;
            
            // 종료 음성 단발성 재생 (my_love2.mp3)
            endBgm.play(); 
            
            // 종료 메시지 타이핑
            await typeWriter(textTop, "곤듀들 오늘도 파이팅!");
            await typeWriter(textBottom, "곤이가 응원해~(찡긋)");
            
            // 3.5초 뒤 뽀샤시하게 사라짐
            setTimeout(() => {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    textTop.innerHTML = "";
                    textBottom.innerHTML = "";
                }, 1000);
            }, 3500);
        }, restTime);

    }, workTime);
};
