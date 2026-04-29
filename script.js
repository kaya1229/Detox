const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('detox-overlay');
const bgm = document.getElementById('bgm');
const textTop = document.getElementById('text-top');
const textBottom = document.getElementById('text-bottom');
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');

let isDetoxMode = false;
let lastMousePos = { x: 0, y: 0 };

// 1. 타자기 효과 함수
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

// 2. 하트 파티클 시스템
let hearts = [];
function createHeart() {
    hearts.push({
        x: canvas.width / 2, y: canvas.height / 2,
        size: Math.random() * 20 + 10,
        speedX: (Math.random() - 0.5) * 10,
        speedY: (Math.random() - 0.5) * 10,
        opacity: 1
    });
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((h, i) => {
        h.x += h.speedX; h.y += h.speedY; h.opacity -= 0.02;
        ctx.font = `${h.size}px Arial`;
        ctx.fillStyle = `rgba(255, 105, 180, ${h.opacity})`;
        ctx.fillText("💖", h.x, h.y);
        if (h.opacity <= 0) hearts.splice(i, 1);
    });
    requestAnimationFrame(animateHearts);
}

// 3. 마우스 감시 및 음성 트리거
window.addEventListener('mousemove', (e) => {
    if (!isDetoxMode) return;

    // 움직임 감지 시
    if (e.clientX !== lastMousePos.x || e.clientY !== lastMousePos.y) {
        if (bgm.paused) bgm.play();
        createHeart();
        document.getElementById('gony-img').style.transform = `scale(${1.1 + Math.random() * 0.1})`;
    }
    
    lastMousePos = { x: e.clientX, y: e.clientY };

    // 0.5초간 멈추면 소리 중단
    clearTimeout(window.mouseTimer);
    window.mouseTimer = setTimeout(() => {
        bgm.pause();
        bgm.currentTime = 0;
    }, 500);
});

// 4. 실행 프로세스
startBtn.onclick = () => {
    const workTime = document.getElementById('work-time').value * 1000 * 60;
    
    setTimeout(async () => {
        isDetoxMode = true;
        overlay.classList.remove('hidden');
        canvas.width = 400; canvas.height = 400;
        animateHearts();

        await typeWriter(textTop, "곤듀들의 눈건강을 위해 곤이가 왔어");
        await typeWriter(textBottom, "곤듀들이 쉬지 않으면 무한 내 사랑 반복이야~~(찡긋)");

        // 휴식 시간 카운트다운 (예: 10분 후 종료)
        const restTime = document.getElementById('rest-time').value * 1000 * 60;
        setTimeout(async () => {
            isDetoxMode = false;
            bgm.pause();
            await typeWriter(textTop, "곤듀들 오늘도 파이팅!");
            await typeWriter(textBottom, "곤이가 응원해~(찡긋)");
            setTimeout(() => overlay.classList.add('hidden'), 2000);
        }, restTime);

    }, workTime);
};
