let  totalTime = 5 * 60; 
let timeLeft = totalTime;
let timerInterval;

const questions = [
  {
    question: "What is Angular primarily used for?",
    options: [
      "Building mobile applications",
      "Building single-page web applications",
      "Creating desktop applications",
      "Database management"
    ],
    correct: 1
  },
  {
    question: "Which language is primarily used to build Angular applications?",
    options: ["JavaScript", "TypeScript", "Python", "Java"],
    correct: 1
  },
  {
    question: "What command is used to create a new Angular project?",
    options: [
      "ng create myApp",
      "ng new myApp",
      "angular new myApp",
      "npm create-angular myApp"
    ],
    correct: 1
  },
  {
    question: "Which directive is used for conditional rendering in Angular?",
    options: ["*ngIf", "*ngFor", "*ngSwitch", "*ngShow"],
    correct: 0
  },
  {
    question: "Which file is the main entry point for an Angular application?",
    options: ["index.html", "main.ts", "app.module.ts", "app.component.ts"],
    correct: 1
  },
  {
    question: "Which symbol is used for data binding in Angular templates?",
    options: ["{}", "[]", "()", "{{}}"],
    correct: 3
  },
  {
    question: "Which Angular service is used for making HTTP requests?",
    options: [
      "HttpModule",
      "HttpClient",
      "HttpService",
      "HttpRequest"
    ],
    correct: 1
  },
  {
    question: "Which CLI command is used to serve an Angular application locally?",
    options: [
      "ng run",
      "ng start",
      "ng serve",
      "ng local"
    ],
    correct: 2
  },
  {
    question: "Which lifecycle hook is called after the component's view has been fully initialized?",
    options: [
      "ngOnInit",
      "ngAfterViewInit",
      "ngDoCheck",
      "ngOnChanges"
    ],
    correct: 1
  },
  {
    question: "Which decorator is used to define a service in Angular?",
    options: [
      "@Injectable",
      "@Service",
      "@Provider",
      "@Component"
    ],
    correct: 0
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
