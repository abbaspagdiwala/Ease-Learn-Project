let  totalTime = 5 * 60; 
let timeLeft = totalTime;
let timerInterval;

const questions = [
  {
    question: "Which of the following is not a feature of OOP?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
    correct: 3
  },
  {
    question: "What is the main purpose of a constructor in C++?",
    options: ["To initialize objects", "To destroy objects", "To call functions", "To inherit classes"],
    correct: 0
  },
  {
    question: "Which keyword is used to inherit a class in C++?",
    options: ["inherits", "extend", ":", "base"],
    correct: 2
  },
   {
    question: "Which header file is required in C++ to use OOP?",
    options: ["OOP can be used without using any header file", " stdlib.h", "iostream.h", "stdio.h"],
    correct: 0
  },
   {
    question: " How many types of access specifiers are provided in OOP (C++)?",
    options: ["4", "3", "2", "1"],
    correct: 2
  },
   {
    question: "How to access data members of a class?",
    options: ["Dot, arrow or direct call", "Dot operator", " Arrow operator", " Dot or arrow as required"],
    correct: 3
  },
   {
    question: "Which operator can be used to free the memory allocated for an object in C++?",
    options: ["Unallocate", "Free()", "Collect", "delete"],
    correct: 3
  },
   {
    question: "Which type of members can’t be accessed in derived classes of a base class?",
    options: [" All can be accessed", " Private", "Public", "Protected"],
    correct: 1
  },
   {
    question: "Which keyword is used to declare virtual functions?",
    options: ["virt", "virtually", " virtual", "anonymous"],
    correct: 2
  },
   {
    question: "What is friend member functions in C++?",
    options: ["Non-member functions which have access to all the members (including private) of a class", " Member function which doesn’t have access to private members", " Member function which can modify any data of a class", " Member function which can access all the members of a class"],
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
