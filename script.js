let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizStarted = false;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const currentQEl = document.getElementById('current-q');
const totalQEl = document.getElementById('total-q');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const percentageEl = document.getElementById('percentage');

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    loadQuestion();
}

function loadQuestion() {
    const q = quizData[currentQuestion];
    currentQEl.textContent = currentQuestion + 1;
    totalQEl.textContent = quizData.length;
    
    questionEl.innerHTML = `<strong>${q.question}</strong>`;
    optionsEl.innerHTML = '';
    
    if (q.type === 'truefalse') {
        optionsEl.innerHTML = `
            <label class="option" data-answer="true">
                <input type="radio" name="answer" value="true"> 正确
            </label>
            <label class="option" data-answer="false">
                <input type="radio" name="answer" value="false"> 错误
            </label>
        `;
    } else if (q.type === 'single') {
        q.options.forEach(opt => {
            optionsEl.innerHTML += `
                <label class="option" data-answer="${opt[0]}">
                    <input type="radio" name="answer" value="${opt[0]}"> ${opt}
                </label>
            `;
        });
    } else if (q.type === 'multiple') {
        q.options.forEach(opt => {
            optionsEl.innerHTML += `
                <label class="option" data-answer="${opt[0]}">
                    <input type="checkbox" name="answer" value="${opt[0]}"> ${opt}
                </label>
            `;
        });
    } else if (q.type === 'fill') {
        // 简化填空题处理
        optionsEl.innerHTML = '<input type="text" id="fill-input" placeholder="请输入答案">';
    }
    
    // 添加事件监听
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            if (q.type === 'multiple') {
                option.classList.toggle('selected');
            } else {
                document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            }
        });
    });
}

function nextQuestion() {
    const q = quizData[currentQuestion];
    let userAnswer = null;
    
    if (q.type === 'truefalse' || q.type === 'single') {
        const selected = document.querySelector('.option.selected');
        userAnswer = selected ? selected.dataset.answer === 'true' : null;
    } else if (q.type === 'multiple') {
        const selected = document.querySelectorAll('.option.selected');
        userAnswer = Array.from(selected).map(s => s.dataset.answer);
    } else if (q.type === 'fill') {
        userAnswer = document.getElementById('fill-input').value.trim();
    }
    
    userAnswers[currentQuestion] = userAnswer;
    
    // 即时反馈
    checkAnswer(q, userAnswer);
    
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
}

function checkAnswer(question, userAnswer) {
    const options = document.querySelectorAll('.option');
    const correctAnswer = question.answer;
    
    if (question.type === 'multiple') {
        // 检查多选题
        const isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort());
        options.forEach(option => {
            const ans = option.dataset.answer;
            if (correctAnswer.includes(ans)) {
                option.classList.add('correct');
            }
            if (userAnswer && userAnswer.includes(ans) && !correctAnswer.includes(ans)) {
                option.classList.add('incorrect');
            }
        });
        if (isCorrect) score++;
    } else {
        // 单选/判断/填空
        const isCorrect = userAnswer == correctAnswer || 
                         (Array.isArray(correctAnswer) && correctAnswer.includes(userAnswer));
        
        options.forEach(option => {
            if (option.dataset.answer === correctAnswer || 
                (Array.isArray(correctAnswer) && correctAnswer.includes(option.dataset.answer))) {
                option.classList.add('correct');
            }
            if (option.classList.contains('selected') && !option.classList.contains('correct')) {
                option.classList.add('incorrect');
            }
        });
        
        if (isCorrect) score++;
    }
}

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    scoreEl.textContent = score;
    totalEl.textContent = quizData.length;
    percentageEl.textContent = ((score / quizData.length) * 100).toFixed(1);
}

function restartQuiz() {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}