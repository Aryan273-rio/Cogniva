import React from "react";

function QuestionCard({

    question,

    currentQuestion,

    totalQuestions,

    selectedAnswer,

    onAnswerSelect

}) {

    return (

        <div className="question-card">

            <h3>

                Question {currentQuestion + 1} of {totalQuestions}

            </h3>

            <h2>

                {question.question}

            </h2>

            <div className="options">

                {

                    question.options.map((option, index) => (

                        <label

                            key={index}

                            className="option"

                        >

                            <input

                                type="radio"

                                name={`question-${currentQuestion}`}

                                value={option}

                                checked={selectedAnswer === option}

                                onChange={() => onAnswerSelect(option)}

                            />

                            {option}

                        </label>

                    ))

                }

            </div>

        </div>

    );

}

export default QuestionCard;