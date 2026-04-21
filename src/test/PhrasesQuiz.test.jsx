import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PhrasesQuiz from "../pages/PhrasesQuiz";

const correctAnswersByPrompt = {
  Hello: "Konnichiwa",
  "Thank you": "Arigatou gozaimasu",
  "Excuse me": "Sumimasen",
  "No thank you": "Iie, kekkou desu",
  "How much does this cost?": "Ikura desu ka?",
  "May I get a fork?": "Fooku o moraemasu ka?",
  "Where is the bathroom?": "Toire wa doko desu ka?",
  "Do you speak English?": "Eigo o hanasemasu ka?",
  "I don't understand": "Wakarimasen",
  "Where is the train station?": "Eki wa doko desu ka?",
};

function getCurrentPrompt(container) {
  return container.querySelector(".quiz-prompt").textContent.replace(/"/g, "");
}

describe("PhrasesQuiz", () => {
  it("shows feedback after answering a question correctly", async () => {
    const user = userEvent.setup();
    const { container } = render(<PhrasesQuiz />);

    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();

    const prompt = getCurrentPrompt(container);
    const correctAnswer = correctAnswersByPrompt[prompt];

    await user.click(screen.getByRole("button", { name: correctAnswer }));

    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Next Question|Finish Quiz/i })
    ).toBeInTheDocument();
  });

  it("can complete the full quiz and restart", async () => {
    const user = userEvent.setup();
    const { container } = render(<PhrasesQuiz />);

    for (let questionNumber = 0; questionNumber < 10; questionNumber += 1) {
      const prompt = getCurrentPrompt(container);
      const correctAnswer = correctAnswersByPrompt[prompt];

      await user.click(screen.getByRole("button", { name: correctAnswer }));
      await user.click(
        screen.getByRole("button", { name: /Next Question|Finish Quiz/i })
      );
    }

    expect(screen.getByText("Quiz Complete!")).toBeInTheDocument();
    expect(screen.getByText("You scored 10 out of 10.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Restart Quiz" }));

    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
  });
});