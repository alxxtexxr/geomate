import Link from 'next/link';
import { Prisma } from '@prisma/client';

// Components
import Button from './EvaluationQuestionPaginationButton';

// Types
type EvaluationQuestion = Prisma.EvaluationQuestionGetPayload<{
    include: {
        question: {
            include: {
                answerChoices: true,
            }
        },
    },
}>;

type Props = {
    evaluationQuestions: EvaluationQuestion[],
    no: number,
};

const EvaluationQuestionPagination = ({ evaluationQuestions, no }: Props) => (
    <nav className="mb-4">
        <ol className="flex overflow-x-scroll px-3">
            {evaluationQuestions.map((evaluationQuestion, i) => (
                <li className="px-1" key={evaluationQuestion.question.id}>
                    <Link href={{
                        pathname: '/evaluations/[id]/no/[no]',
                        query: { id: evaluationQuestion.evaluationId, no: i + 1 },
                    }}>
                        <a>
                            <Button
                                isActive={no - 1 === i}
                                isAnswered={!!evaluationQuestion.answer}
                            >
                                {i + 1}
                            </Button>
                        </a>
                    </Link>
                </li>
            ))}
        </ol>
    </nav>
);

export default EvaluationQuestionPagination;
