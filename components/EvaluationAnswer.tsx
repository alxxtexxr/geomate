type Props = {
    isCorrect: boolean,
    no: number
};

const EvaluationAnswer = ({ isCorrect, no }: Props) => (
    <div className={
        'btn w-12' +
        (
            isCorrect
                ? ' hover:bg-green-500 bg-green-500 hover:bg-opacity-5 bg-opacity-5 text-green-500 hover:border-green-500 border-green-500'
                : ' hover:bg-red-500 bg-red-500 hover:bg-opacity-5 bg-opacity-5 text-red-500 hover:border-red-500 border-red-500'
        )
    }>
        {no}
    </div>
);


export default EvaluationAnswer;