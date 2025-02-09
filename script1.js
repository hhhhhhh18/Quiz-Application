let Questions = [];
const ques = document.getElementById("ques");

// Fetch questions from API
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10 &container=18');
        if (!response.ok) {
            throw new Error(`Something went wrong!! Unable to fetch the data`);
        }
        const data = await response.json();
        Questions = data.results;
        loadQues(); // Ensure questions are loaded immediately after fetching
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
    }
}

fetchQuestions();

let currQuestion = 0;
let score = 0;

if (Questions.length === 0) {
    ques.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
}

function loadQues() {
    const opt = document.getElementById("opt");
    let currentQuestion = Questions[currQuestion].question;
    currentQuestion = currentQuestion.replace(/&quot;/g, '\"').replace(/&#039;/g, '\'');
    ques.innerText = currentQuestion;
    opt.innerHTML = "";
    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;
    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5);
    options.forEach((option) => {
        option = option.replace(/&quot;/g, '\"').replace(/&#039;/g, '\'');
        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");
        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;
        choiceLabel.textContent = option;
        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });
}

setTimeout(() => {
    loadQues();
    if (Questions.length === 0) {
        ques.innerHTML = `<h5 style='color: red'>Unable to fetch data, Please try again!!</h5>`;
    }
}, 2000);

function loadScore() {
    const totalScore = document.getElementById("score");
    totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
    totalScore.innerHTML += "<h3>All Answers</h3>";
    Questions.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
    });

    // Add a congratulatory message
    if (score === Questions.length) {
        totalScore.innerHTML += "<h2>Congratulations! You got all the answers correct!</h2>";
    } else if (score > Questions.length / 2) {
        totalScore.innerHTML += "<h2>Great job! You scored above half!</h2>";
    } else {
        totalScore.innerHTML += "<h2>Good effort! Keep practicing to improve your score!</h2>";
    }

    // Disable buttons
    disableButtons();
}

function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").remove();
        document.getElementById("ques").remove();
        document.getElementById("btn").remove();
        loadScore();
    }
}

function prevQuestion() {
    if (currQuestion > 0) {
        currQuestion--;
        loadQues();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (selectedAns && selectedAns.value === Questions[currQuestion].correct_answer) {
        score++;
    }
    nextQuestion();
}

function disableButtons() {
    const nextButton = document.getElementById("nxt");
    const prevButton = document.getElementById("prev");
    const submitButton = document.getElementById("btn");

    if (nextButton) {
        nextButton.disabled = true;
    }

    if (prevButton) {
        prevButton.disabled = true;
    }

    if (submitButton) {
        submitButton.disabled = true;
    }
}
