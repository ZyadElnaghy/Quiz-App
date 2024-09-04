export default class Quiz {
  constructor(
    questions,
    questionDom,
    answersDom,
    prgBar,
    timerDom,
    savedQuestionsContainerDom,
    numOfSavedQuestionsElementDom,
    nextBtnDom,
    prevBtnDom,
    submitBtnDom,
    addEventListenersToSavedQuestions,
    addEventListenerToOptions,
  ) {
    this.questions = questions;
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.isFirstQuestion = true;
    this.isLastQuestion = false;
    this.questionDom = questionDom;
    this.answersDom = answersDom;
    this.timerDom = timerDom;
    this.prgBar = prgBar;
    this.savedQuestionsContainerDom = savedQuestionsContainerDom;
    this.numOfSavedQuestionsElementDom = numOfSavedQuestionsElementDom;
    this.nextBtnDom = nextBtnDom;
    this.prevBtnDom = prevBtnDom;
    this.submitBtnDom = submitBtnDom;
    this.addEventListenersToSavedQuestions = addEventListenersToSavedQuestions;
    this.userAnswers = {};
    this.savedQuestions = [];
    this.timerRef = null;

    /*  */
    addEventListenerToOptions();
  }

  startTimer() {
    let time = 60 * 5 * 1000;
    this.timerRef = setInterval(() => {
      time -= 1000;
      let minutes = Math.floor(time / 60000);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      let seconds = Math.floor((time % 60000) / 1000);
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      this.timerDom.textContent = `${minutes}:${seconds}`;

      if (time <= 0) {
        clearInterval(this.timerRef);

        this._quizTimeout();
        this._calculateScore();
      }
    }, 1000);
  }

  goToQuestion(index) {
    this.currentQuestionIndex = index;
    this.renderQuestion();
  }

  toggleSaveQuestion() {
    if (!this.savedQuestions.includes(this.currentQuestionIndex))
      this.savedQuestions.push(this.currentQuestionIndex);
    else
      this.savedQuestions = this.savedQuestions.filter(
        (index) => index !== this.currentQuestionIndex
      );

    this.renderQuestion();
  }

  _renderSavedQuestions() {
    const listOfBtns = [];
    this.savedQuestions.sort((a, b) => a - b);

    for (const index of this.savedQuestions) {
      const btn = document.createElement("button");
      btn.textContent = `Question ${index + 1}`;
      btn.setAttribute("data-index", index);

      listOfBtns.push(btn.outerHTML);
    }

    this.savedQuestionsContainerDom.innerHTML = listOfBtns.join("");

    this.numOfSavedQuestionsElementDom.textContent = this.savedQuestions.length;
  }

  checkAnswer(answerIndex) {
    this.userAnswers[this.currentQuestionIndex] = answerIndex;
    this.renderQuestion();
  }

  _quizTimeout() {
    // render the screen of the quiz time out
  }

  _handleDisabledBtns() {
    if (this.isFirstQuestion) this.prevBtnDom.disabled = true;
    else this.prevBtnDom.disabled = false;
  
    if (this.isLastQuestion) this.nextBtnDom.disabled = true;
    else this.nextBtnDom.disabled = false;
  }
  

  _handleProgressBar() {
    this.prgBar.value =
      ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  _handleFirstOrLastQuestion() {
    this.isFirstQuestion = this.currentQuestionIndex === 0;
    this.isLastQuestion =
      this.currentQuestionIndex === this.questions.length - 1;
  }

  _renderQuestion() {
    this.questionDom.innerHTML = `
    <h3>Question ${this.currentQuestionIndex + 1}</h3>
    <p>${this.questions[this.currentQuestionIndex].question}</p>
    `;
  }

  _renderAnswers() {
    for (let i = 0; i < 4; i++) {
      this.answersDom[i].textContent =
        this.questions[this.currentQuestionIndex].answers[i];

      if (this.userAnswers[this.currentQuestionIndex] === i) {
        if (!this.answersDom[i].classList.contains("selected"))
          this.answersDom[i].classList.add("selected");
      } else this.answersDom[i].classList.remove("selected");
    }
  }

  renderQuestion() {
    this._handleProgressBar();
    this._handleFirstOrLastQuestion();
    this._renderSavedQuestions();
    this._renderQuestion();
    this._renderAnswers();
    this._handleDisabledBtns();
    this.addEventListenersToSavedQuestions();
  }

  _calculateScore() {
    this._stopTimer();

    this.score = 0;
    this.questions.forEach((question, i) => {
      if (question.correctAnswer === question.answers[this.userAnswers[i]])
        this.score++;
    });
    return this.score;
  }

  getResultObject() {
    return {
      question: this.questions.question,
      answers: this.questions.answers,
      userAnswers: this.userAnswers,
      correctAnswers: this.questions.correctAnswer,
      score: this.score,
    };
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.renderQuestion();
  }

  prevQuestion() {
    this.currentQuestionIndex--;
    this.renderQuestion();
  }

  _stopTimer() {
    clearInterval(this.timerRef);
  }
}
