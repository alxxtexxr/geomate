type Props = {
    isCorrect: boolean,
    no: number
};

const EvaluationQuestionAnswer = ({ isCorrect, no }: Props) => (
    <div className={
        'btn w-12' +
        (
            isCorrect
                ? ' hover:bg-green-500 bg-green-500 hover:bg-opacity-20 bg-opacity-20 text-green-500 hover:border-green-500 border-green-500'
                : ' hover:bg-red-500 bg-red-500 hover:bg-opacity-20 bg-opacity-20 text-red-500 hover:border-red-500 border-red-500'
        )
    }>
        {no}
    </div>
);


export default EvaluationQuestionAnswer;