import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type Props = {
    isActive: boolean,
    isAnswered: boolean,
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const EvaluationQuestionPaginationButton = ({ isActive, isAnswered, children }: Props) => (
    <button
        className={
            'btn btn-circle hover:bg-primary hover:border-primary hover:text-primary-content border-primary' +
            (isActive
                ? '  bg-primary text-primary-content shadow'
                : (isAnswered
                    ? ' bg-primary bg-opacity-5 text-primary'
                    : ' text-primary'))
        }
    >
        {children}
    </button>
);

export default EvaluationQuestionPaginationButton;