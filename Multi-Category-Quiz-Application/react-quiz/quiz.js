let  totalTime = 5 * 60;
let timeLeft = totalTime;
let timerInterval;

const questions = [
  {
    question: "What is React primarily used for?",
    options: [
      "Building server-side applications",
      "Styling HTML pages",
      "Building user interfaces",
      "Managing databases"
    ],
    correct: 2
  },
  {
    question: "What is the command to create a new React application using Create React App?",
    options: [
      "npm create-react",
      "npx create-react-app myApp",
      "react-create myApp",
      "npx new react myApp"
    ],
    correct: 1
  },
  {
    question: "Which of the following is used to pass data to a React component?",
    options: ["state", "props", "data", "setState"],
    correct: 1
  },
  {
    question: "What is the default port number for a React app started with npm start?",
    options: ["3000", "8080", "5000", "4200"],
    correct: 0
  },
  {
    question: "Which hook is used to manage state in a functional component?",
    options: ["useEffect", "useState", "useReducer", "useRef"],
    correct: 1
  },
  {
    question: "What is JSX in React?",
    options: [
      "JavaScript Extension Syntax",
      "JavaScript XML",
      "JSON XML Syntax",
      "Java Syntax Extension"
    ],
    correct: 1
  },
  {
    question: "How do you handle side effects in React functional components?",
    options: ["useState", "useEffect", "useRef", "useMemo"],
    correct: 1
  },
  {
    question: "Which method is used to render React elements into the DOM?",
    options: [
      "React.render()",
      "ReactDOM.render()",
      "renderDOM()",
      "DOM.render()"
    ],
    correct: 1
  },
  {
    question: "What is the correct way to update state in React?",
    options: [
      "state.value = newValue",
      "setState(newValue)",
      "updateState(newValue)",
      "this.state = newValue"
    ],
    correct: 1
  },
  {
    question: "Which tool can be used to debug React applications?",
    options: [
      "React DevTools",
      "Redux Debugger",
      "Chrome DevTools",
      "All of the above"
    ],
    correct: 3
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
    clearInterval(timerInterval); 
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
  let timeTaken = totalTime - timeLeft;
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
