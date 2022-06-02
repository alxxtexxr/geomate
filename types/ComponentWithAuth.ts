import { NextComponentType, NextPageContext } from 'next';

type ComponentWithAuth<P = {}> = React.FC<P> & { auth: boolean };

export default ComponentWithAuth;