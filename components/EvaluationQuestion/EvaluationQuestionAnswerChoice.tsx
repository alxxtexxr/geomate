import { ChangeEventHandler } from 'react';

type Props = {
    id: string,
    answer: string,
    isAnswered: boolean,
    choice: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
};

const EvaluationQuestionAnswerChoice = ({ id, answer, isAnswered, choice, onChange }: Props) => (
    <label
        htmlFor={id}
        className={
            'btn flex-nowrap justify-start text-left font-normal normal-case leading-normal h-auto py-4' +
            (
                isAnswered
                    ? ' bg-primary hover:bg-primary bg-opacity-5 hover:bg-opacity-5 text-primary border-primary hover:border-primary'
                    : ' bg-white hover:bg-white text-gray-500 border-white hover:border-primary shadow'
            )
        }
    >
        <input
            type="radio"
            name="answer"
            id={id}
            className="hidden"
            value={id}
            onChange={onChange}
        />
        <div>
            <span className={
                'badge text-primary h-8 w-8 -my-4 mr-4 border-none' +
                (
                    !isAnswered
                        ? ' bg-primary bg-opacity-20'
                        : ''
                )
            }>
                {choice}
            </span>
        </div>
        {answer}
    </label>
);

export default EvaluationQuestionAnswerChoice;