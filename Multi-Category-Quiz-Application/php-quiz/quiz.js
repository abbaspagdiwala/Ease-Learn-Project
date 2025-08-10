let  totalTime = 5 * 60; // 5 minutes in seconds (change as needed)
let timeLeft = totalTime;
let timerInterval;

const questions = [
  {
    question: "What does PHP stand for?",
    options: [
      "Personal Hypertext Processor",
      "PHP: Hypertext Preprocessor",
      "Private Home Page",
      "Preprocessed Hypertext Page"
    ],
    correct: 1
  },
  {
    question: "Which symbol is used to start a variable in PHP?",
    options: ["$", "#", "@", "&"],
    correct: 0
  },
  {
    question: "Which function is used to output data in PHP?",
    options: ["echo", "print", "Both echo and print", "write"],
    correct: 2
  },
  {
    question: "Which of the following is the correct way to start a PHP block?",
    options: ["<php>", "<?php", "<?", "<script php>"],
    correct: 1
  },
  {
    question: "Which operator is used for string concatenation in PHP?",
    options: ["+", ".", "&", ","],
    correct: 1
  },
  {
    question: "Which superglobal variable is used to collect form data sent with POST method?",
    options: ["$_GET", "$_POST", "$_REQUEST", "$_FORM"],
    correct: 1
  },
  {
    question: "What will `count([1, 2, 3])` return in PHP?",
    options: ["2", "3", "4", "Error"],
    correct: 1
  },
  {
    question: "Which function is used to connect to a MySQL database in PHP (MySQLi)?",
    options: ["mysqli_connect()", "mysql_connect()", "db_connect()", "pdo_connect()"],
    correct: 0
  },
  {
    question: "Which function is used to include another PHP file?",
    options: ["require", "include", "Both include and require", "import"],
    correct: 2
  },
  {
    question: "Which of the following is true about PHP?",
    options: [
      "It is a client-side scripting language",
      "It is a server-side scripting language",
      "It is only used for desktop applications",
      "It is a markup language"
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
