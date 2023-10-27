/*===== ELEMENTS ======*/
let game = document.getElementById("game");
let div_score = document.getElementById("score");
let lives = document.getElementById('lives');
let div_level = document.getElementById('level');
let pumpkin = document.getElementById('pumpkin');

/*====== BUTTONS ======*/
let btn_left = document.getElementById('btn_left');
let btn_right = document.getElementById('btn_right')
let btn_start = document.getElementById('btn_start');

/*====== BOOLEANS ======*/
let isGameStarted = false;

/*====== VARIABLES ======*/
let level = 1;
let score = 0;
let pumpkinSize = pumpkin.offsetWidth;

/* ====== BUTTONS ====== */
btn_left.addEventListener('click', () => movePumpkin(-pumpkinSize));
btn_right.addEventListener('click', () => movePumpkin(pumpkinSize));
btn_start.addEventListener('click', () => isGameStarted ? endGame() : startGame());

const movePumpkin = (step) => {
    const pumpkinPosition = pumpkin.offsetLeft + step;
    pumpkin.style.left = Math.max(0, Math.min(game.clientWidth - pumpkinSize, pumpkinPosition)) + 'px';
}

/* ====== CANDY ====== */
const createCandy = () => {
    const candy = document.createElement('div');
    candy.className = 'candy';
    candy.style.left = Math.floor(Math.random() * (game.clientWidth - pumpkinSize)) + 'px';
    candy.style.animationDuration = (2 - level * 0.2) + 's';
    game.appendChild(candy);
    objectDrop(candy);
}

const removeCandy = (candy) => {
    candy.remove();
}

const objectDrop = (candy) => {
    let candyPosition = 0;

    const animateCandyDrop = () => {
        candyPosition += level;
        candy.style.top = candyPosition + 'px';
        let output = document.getElementById('output');
        output.innerText = 'candyPosition: ' + candyPosition + 'px' + '\n' + 'game.clientHeight: ' + game.clientHeight + 'px' + '\n' + 'pumpkinSize: ' + pumpkinSize + 'px';

        if (candyPosition <= game.clientHeight - pumpkinSize) {
            requestAnimationFrame(animateCandyDrop);
            return;
        }

        if (isCollide(candy, pumpkin)) {
            level += (score % 3 === 0 && score !== 0);
            changeScore(1);
            showEffect(pumpkin);
            removeCandy(candy);
            createCandy();
            return;
        }

        const livesList = lives.children;
        livesList[0].remove();
        if (livesList.length === 0) {
            return endGame();
        }else {
            for(const live of livesList)showEffect(live);
            changeScore(-1);
            removeCandy(candy);
            createCandy();
        }
    };

    requestAnimationFrame(animateCandyDrop);
};

const showEffect = (element) => {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 100);
}

const isCollide = (a, b) => {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

/* ====== GAME ====== */
const endGame = () => {
    btn_start.innerText = 'Start';
    location.reload();
    isGameStarted = false;
}

const startGame = () => {
    createCandy();
    btn_start.innerText = 'Stop';
    isGameStarted = true;
}

const changeScore = (value) => {
    score += value;
    score = Math.max(0, score); // Перевірте, чи score > 0, якщо ні, встановіть його на 0
    div_score.innerText = score;
    div_level.innerText = level;
}

