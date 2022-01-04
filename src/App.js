import React, { useState, useEffect } from 'react';
const axios = require('axios');

export default function App() {

	const buildOptions = (answerOptions, iscorrect) => {
		return answerOptions.map(question => (
			{
				answerText: question,
				isCorrect: iscorrect
			}
		))
	}
	const buildQuestions = (questions) => {
		const questionArray = [];
		questions.map(question => {
			questionArray.push(
				{
					questionText: question.question,
					answerOptions: shuffleArray([...buildOptions([...question.incorrect_answers], false), ...buildOptions([question.correct_answer], true)]),
					category: question.category
				}
			)
		})
		setQuestions(questionArray)
	}
	
	useEffect(() => {
		async function fetchMyAPI() {
		  let response = await axios.get('https://opentdb.com/api.php?amount=10');
		  buildQuestions(response.data.results)
		}
	
		fetchMyAPI()
	  }, [])

	const [questions, setQuestions] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
	const [disableButton, setDisableButton] = useState(false);
	const [clickedAnswer, setClickedAnswer] = useState(null);

	const handleAnswerOptionClick = (isCorrect, text) => {
		setDisableButton(true);
		setClickedAnswer(text);
		if (isCorrect) {
			setScore(score + 1);
		}
	};
	const handleNextOnClick = () => {
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
		setDisableButton(false);
	}

	function shuffleArray(array) {
		let i = array.length - 1;
		for (; i > 0; i--) {
		  const j = Math.floor(Math.random() * (i + 1));
		  const temp = array[i];
		  array[i] = array[j];
		  array[j] = temp;
		}
		return array;
	}
	return (
		<div>
			{questions ? (
			<div className='app'>
				{showScore ? (
					<div className='score-section-summary'>
						You scored {score} out of {questions.length}
					</div>
				) : (
					<>
						<div className='question-section'>
							<div className='question-count'>
								<span>Question {currentQuestion + 1}</span>/{questions.length}
							</div>
							<div className='category'>
								Category:
								<span className='category-name'>{questions[currentQuestion].category}</span>
							</div>
							<div className='question-text'>{questions[currentQuestion].questionText}</div>
							<div className='score-section'>
								{score} out of {questions.length}
							</div>
						</div>
						<div className='answer-section'>
							{questions[currentQuestion].answerOptions.map((answerOption) => (
								<button className={!disableButton ? 'button-enable' : clickedAnswer && answerOption.isCorrect ? 'button-disable correct' : clickedAnswer && clickedAnswer === answerOption.answerText && !answerOption.isCorrect ? 'button-disable incorrect' : 'button-disable' } disabled={disableButton} onClick={() => handleAnswerOptionClick(answerOption.isCorrect, answerOption.answerText)}>{answerOption.answerText}</button>
							))}
						</div>
						<div className='next-section'>
							<button className={disableButton ? 'button-enable' : 'button-disable' } disabled={!disableButton} onClick={() => handleNextOnClick()}>Next</button>  
						</div>
					</>
				)}
			</div>
			) : null}
		</div>
	);
}