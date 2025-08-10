let  totalTime = 5 * 60; // 5 minutes in seconds (change as needed)
let timeLeft = totalTime;
let timerInterval;

const questions = [
  {
    question: "What is Node.js primarily used for?",
    options: [
      "Building user interfaces",
      "Server-side scripting",
      "Styling web pages",
      "Database management"
    ],
    correct: 1
  },
  {
    question: "Node.js is built on which JavaScript engine?",
    options: [
      "SpiderMonkey",
      "Chakra",
      "V8",
      "Nitro"
    ],
    correct: 2
  },
  {
    question: "Which command is used to initialize a new Node.js project?",
    options: [
      "npm start",
      "node init",
      "npm init",
      "node new"
    ],
    correct: 2
  },
  {
    question: "Which module is used to create a web server in Node.js?",
    options: [
      "http",
      "fs",
      "url",
      "server"
    ],
    correct: 0
  },
  {
    question: "Which of the following is NOT a core module in Node.js?",
    options: [
      "fs",
      "http",
      "events",
      "express"
    ],
    correct: 3
  },
  {
    question: "Which method is used to read files in Node.js asynchronously?",
    options: [
      "fs.readFile()",
      "fs.getFile()",
      "fs.read()",
      "fs.loadFile()"
    ],
    correct: 0
  },
  {
    question: "What does npm stand for?",
    options: [
      "Node Programming Manager",
      "Node Package Manager",
      "Network Package Manager",
      "Node Project Manager"
    ],
    correct: 1
  },
  {
    question: "Which function is used to write to the console in Node.js?",
    options: [
      "print()",
      "console.write()",
      "console.log()",
      "log.console()"
    ],
    correct: 2
  },
  {
    question: "Which object is used to work with the current module in Node.js?",
    options: [
      "exports",
      "module",
      "module.exports",
      "require"
    ],
    correct: 2
  },
  {
    question: "Which framework is commonly used with Node.js for building web applications?",
    options: [
      "Laravel",
      "Express.js",
      "Spring Boot",
      "Django"
    ],
    correct: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;
let answered = Array(questions.length).fill(false);
let selectedOptions = Array(questions.length).fill(null);

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score-display");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const toggleBtn = document.getElementById("toggle-sidebar");
const sidebar = document.getElementById("quiz-sidebar");
const mainContent = document.querySelector(".quiz-main");
const submitBtn = document.getElementById("submit-btn");

toggleBtn.addEventListener("click", () => {
 sidebar.classList.toggle("hidden");
  mainContent.classList.toggle("full-width");
});

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
});

submitBtn.addEventListener("click", () => {
  if (answered.every(a => a)) {
    clearInterval(timerInterval); // stop timer
    saveResultsAndGoToResultPage();
  }
});

function startTimer() {
  const timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = formatTime(timeLeft);

  timerInterval = setInterval(() => {
    timerDisplay.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoSubmit();
    }
    timeLeft--;
  }, 1000);
}

function autoSubmit() {
  saveResultsAndGoToResultPage();
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function saveResultsAndGoToResultPage() {
  let timeTaken = totalTime - timeLeft; // time used in seconds
  localStorage.setItem("quizScore", score);
  localStorage.setItem("totalQuestions", questions.length);
  localStorage.setItem("quizQuestions", JSON.stringify(questions));
  localStorage.setItem("quizAnswers", JSON.stringify(selectedOptions));
  localStorage.setItem("timeTaken", timeTaken);
  window.location.href = "../result.html";
}



function buildQuestionIndex() {
  const indexContainer = document.getElementById("index-buttons");
  indexContainer.innerHTML = "";
  questions.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.textContent = "Q " + (index+1);
    btn.classList.add("index-btn");
    btn.addEventListener("click", () => {
      currentQuestionIndex = index;
      showQuestion();
    });
    
    indexContainer.appendChild(btn);
  });
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.textContent = `${currentQuestionIndex + 1}. ${q.question}`;
  optionsContainer.innerHTML = "";
  feedback.textContent = "";

  q.options.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");

    // Restore answered state colors
   if (answered[currentQuestionIndex]) {
  btn.disabled = true;
  if (idx === q.correct) {
    btn.classList.add("correct");
  }
  if (selectedOptions[currentQuestionIndex] === idx && idx !== q.correct) {
    btn.classList.add("wrong");
  }
}


    btn.addEventListener("click", () => handleAnswer(idx, btn));
    optionsContainer.appendChild(btn);
  });

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === questions.length - 1;

  updateIndexHighlight();
  updateSubmitState();
}


function handleAnswer(selectedIndex, btn) {
  const q = questions[currentQuestionIndex];
  const optionButtons = document.querySelectorAll(".option-btn");

  if (!answered[currentQuestionIndex]) {
    selectedOptions[currentQuestionIndex] = selectedIndex;
    optionButtons.forEach(b => b.disabled = true);

   if (selectedIndex === q.correct) {
  btn.classList.add("correct");
  feedback.textContent = "Correct!";
  score++;
} else {
  btn.classList.add("wrong");
  feedback.textContent = "Wrong!";
  optionButtons[q.correct].classList.add("correct");
}


    answered[currentQuestionIndex] = true;
    scoreDisplay.textContent = `Score: ${score}`;
    updateIndexHighlight();
    updateSubmitState();
  }
}

function updateIndexHighlight() {
  const indexButtons = document.querySelectorAll(".index-btn");
  indexButtons.forEach((btn, idx) => {
    btn.style.backgroundColor = answered[idx] ? "#ccc" : "";
    btn.style.border = idx === currentQuestionIndex ? "2px solid blue" : "1px solid #ddd";
  });
}

function updateSubmitState() {
  submitBtn.disabled = !answered.every(a => a);
}

document.addEventListener("DOMContentLoaded", () => {
  buildQuestionIndex();
  showQuestion();
  startTimer();
});
