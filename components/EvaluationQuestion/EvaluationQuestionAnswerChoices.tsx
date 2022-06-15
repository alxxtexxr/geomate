import { default as AnswerChoiceComponent } from './EvaluationQuestionAnswerChoice';

// Types
import type { Dispatch, SetStateAction } from 'react';
import type { AnswerChoice } from '@prisma/client';

type Props = {
    answerChoices: AnswerChoice[],
    answer: string | null,
    setAnswer: Dispatch<SetStateAction<string | null>>,
};

const EvaluationQuestionAnswerChoices = ({ answerChoices, answer, setAnswer }: Props) => (
    <div className="grid grid-cols-1 gap-4">
        {answerChoices.map((answerChoice, i) => (
            <AnswerChoiceComponent
                {...answerChoice}
                isAnswered={answerChoice.id === answer}
                choice={['A', 'B', 'C', 'D'][i]}
                onChange={(e) => setAnswer(e.target.value)}
                key={answerChoice.id}
            />
        ))}
    </div>
);

export default EvaluationQuestionAnswerChoices;