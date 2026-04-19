import { useState } from "react";

const questionBank = [
  {
    prompt: "Hello",
    correctAnswer: "Konnichiwa",
    options: [
      "Konnichiwa",
      "Arigatou gozaimasu",
      "Sumimasen",
      "Toire wa doko desu ka?",
    ],
  },
  {
    prompt: "Thank you",
    correctAnswer: "Arigatou gozaimasu",
    options: [
      "Ikura desu ka?",
      "Arigatou gozaimasu",
      "Fooku o moraemasu ka?",
      "Iie, kekkou desu",
    ],
  },
  {
    prompt: "Excuse me",
    correctAnswer: "Sumimasen",
    options: [
      "Sumimasen",
      "Konnichiwa",
      "Eigo o hanasemasu ka?",
      "Wakarimasen",
    ],
  },
  {
    prompt: "No thank you",
    correctAnswer: "Iie, kekkou desu",
    options: [
      "Arigatou gozaimasu",
      "Iie, kekkou desu",
      "Ikura desu ka?",
      "Toire wa doko desu ka?",
    ],
  },
  {
    prompt: "How much does this cost?",
    correctAnswer: "Ikura desu ka?",
    options: [
      "Sumimasen",
      "Eki wa doko desu ka?",
      "Ikura desu ka?",
      "Konnichiwa",
    ],
  },
  {
    prompt: "May I get a fork?",
    correctAnswer: "Fooku o moraemasu ka?",
    options: [
      "Fooku o moraemasu ka?",
      "Arigatou gozaimasu",
      "Wakarimasen",
      "Toire wa doko desu ka?",
    ],
  },
  {
    prompt: "Where is the bathroom?",
    correctAnswer: "Toire wa doko desu ka?",
    options: [
      "Eki wa doko desu ka?",
      "Toire wa doko desu ka?",
      "Ikura desu ka?",
      "Konnichiwa",
    ],
  },
  {
    prompt: "Do you speak English?",
    correctAnswer: "Eigo o hanasemasu ka?",
    options: [
      "Eigo o hanasemasu ka?",
      "Sumimasen",
      "Arigatou gozaimasu",
      "Iie, kekkou desu",
    ],
  },
  {
    prompt: "I don't understand",
    correctAnswer: "Wakarimasen",
    options: [
      "Konnichiwa",
      "Wakarimasen",
      "Fooku o moraemasu ka?",
      "Ikura desu ka?",
    ],
  },
  {
    prompt: "Where is the train station?",
    correctAnswer: "Eki wa doko desu ka?",
    options: [
      "Eki wa doko desu ka?",
      "Toire wa doko desu ka?",
      "Sumimasen",
      "Arigatou gozaimasu",
    ],
  },
];

function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function buildQuizQuestions() {
  return shuffleArray(questionBank).map((question) => ({
    ...question,
    options: shuffleArray(question.options),
  }));
}

function PhrasesQuiz() {
  const [quizQuestions, setQuizQuestions] = useState(() => buildQuizQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  function handleAnswerClick(answer) {
    if (hasAnswered) return;

    setSelectedAnswer(answer);
    setHasAnswered(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  }

  function handleNextQuestion() {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer("");
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
    }
  }

  function handleRestartQuiz() {
    setQuizQuestions(buildQuizQuestions());
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
  }

  function getButtonClassName(option) {
    if (!hasAnswered) return "quiz-option";

    if (option === currentQuestion.correctAnswer) {
      return "quiz-option correct";
    }

    if (option === selectedAnswer) {
      return "quiz-option incorrect";
    }

    return "quiz-option";
  }

  if (quizFinished) {
    return (
      <section className="quiz-page">
        <h2>Japanese Phrases Quiz</h2>
        <div className="quiz-card">
          <h3>Quiz Complete!</h3>
          <p>
            You scored {score} out of {quizQuestions.length}.
          </p>
          <button
            type="button"
            className="quiz-next-button"
            onClick={handleRestartQuiz}
          >
            Restart Quiz
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-page">
      <h2>Japanese Phrases Quiz</h2>

      <div className="quiz-card">
        <p className="quiz-progress">
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </p>

        <h3>Which romaji phrase means:</h3>
        <p className="quiz-prompt">"{currentQuestion.prompt}"</p>

        <div className="quiz-options">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              type="button"
              className={getButtonClassName(option)}
              onClick={() => handleAnswerClick(option)}
              disabled={hasAnswered}
            >
              {option}
            </button>
          ))}
        </div>

        {hasAnswered && (
          <div className="quiz-feedback">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p>Correct!</p>
            ) : (
              <p>
                Not quite. The correct answer is {currentQuestion.correctAnswer}.
              </p>
            )}

            <button
              type="button"
              className="quiz-next-button"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex === quizQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default PhrasesQuiz;