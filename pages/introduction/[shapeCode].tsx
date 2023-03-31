import { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Router from 'next/router';
import Typewriter from 'typewriter-effect';

// Components
import Navbar from '../../components/Navbar';
import MessageBalloon from '../../components/MessageBalloon';
import Loading from '../../components/Loading';

// Util
import { getShape } from '../../Utils';

// Types
import type { GetServerSideProps } from 'next';
import type { Observation } from '@prisma/client';
import type ComponentWithAuth from '../../types/ComponentWithAuth';
import type Shape from '../../types/Shape';

type Props = {
    shape: Shape,
};

type Message = {
    sender: 'mascot' | 'user',
    message: string,
    image?: string,
};

const Introduction: ComponentWithAuth<Props> = ({ shape }) => {
    const TYPING_DELAY = 25;

    // Session
    const { data: session } = useSession();

    // Ref
    const messagesWrapperRef = useRef<HTMLDivElement>(null);
    const messagesSubWrapperRef = useRef<HTMLDivElement>(null);

    // States
    // const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'mascot',
            message: shape.introductionMessages[0].message,
            image: shape.introductionMessages[0].image,
        },
    ]);
    const [shouldReverse, setShouldReverse] = useState(false);

    const isReplyShowing = (messages.length % 2 !== 0 && !isTyping);


    // Effect
    const scrollToBottom = () => {
        if (messagesWrapperRef.current) {
            messagesWrapperRef.current.scrollTo({ top: messagesWrapperRef.current.scrollHeight })
        }
    }

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isTyping && !shouldReverse) {
            intervalId = setInterval(() => {
                if (messagesSubWrapperRef.current && messagesWrapperRef.current) {
                    setShouldReverse(messagesSubWrapperRef.current.offsetHeight > messagesWrapperRef.current.offsetHeight)
                }
            }, TYPING_DELAY * 4);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isTyping]);

    // Function
    const startObservation = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/observations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shapeCode: shape.code,
                }),
            });
            const observation: Observation = await res.json();

            await Router.push(`/observations/${observation.id}/steps/1`);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <main className="relative flex flex-col bg-base-100 h-screen w-inherit">
            <Head>
                <title>{shape.name} | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>

            <div className="fixed z-10 w-inherit bg-base-100 bg-opacity-95">
                <Navbar.Top title={shape.name} backHref="/" />
            </div>

            <div
                ref={messagesWrapperRef}
                className={'flex-grow overflow-y-scroll ' + (shouldReverse ? 'flex flex-col-reverse' : '')}
            >
                <div ref={messagesSubWrapperRef} className="grid grid-cols-1 gap-2 px-4 pt-16 pb-38">
                    {messages.map((message, i) => {
                        // const messageColorBalloon = message.sender === 'mascot' ? 'white' : 'base-200';
                        const isMascot = message.sender === 'mascot';
                        const isUser = message.sender === 'user';

                        return (
                            <div className="grid grid-cols-12 gap-4" key={i}>

                                <div className="relative col-span-3 w-full aspect-square drop-shadow-md-blue-800">
                                    {isMascot && (
                                        <Image
                                            src="/images/geo-head.svg"
                                            alt="Geo"
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    )}
                                </div>

                                <MessageBalloon
                                    color={isUser ? 'primary' : 'white'}
                                    position={isMascot ? 'tl' : 'tr'}
                                    className="col-span-8 flex-grow text-gray-600 text-sm shadow-sm shadow-blue-800/10"
                                >
                                    <div className="font-semibold mb-2">
                                        {isMascot ? 'Geo' : session?.user.name}
                                    </div>
                                    <Typewriter
                                        options={{
                                            delay: TYPING_DELAY,
                                            cursor: '',
                                        }}
                                        onInit={(typewriter) => {
                                            let _typewriter = typewriter.typeString(message.message)

                                            console.log({ message });
                                            if (message.image) {
                                                _typewriter = _typewriter.typeString(`<img class="mt-4 rounded-md" src="${message.image}" />`);
                                            }

                                            _typewriter.callFunction(() => {
                                                if (isUser) {
                                                    setIsTyping(true);

                                                    // If messages are not completed
                                                    if (Math.ceil(messages.length / 2) < shape.introductionMessages.length) {
                                                        setMessages([
                                                            ...messages,
                                                            {
                                                                sender: 'mascot',
                                                                message: shape.introductionMessages[Math.ceil(messages.length / 2)].message,
                                                            },
                                                        ]);
                                                    } else {
                                                        startObservation();
                                                    }
                                                }

                                                if (isMascot) {
                                                    setIsTyping(false);
                                                }
                                            })
                                                .start();
                                        }}
                                    />
                                </MessageBalloon>
                            </div>
                        );
                    })}
                </div>
            </div >

            <div className="fixed bottom-0 w-inherit grid grid-cols-1 gap-2 bg-white bg-opacity-95 p-4 rounded-t-2xl shadow-md shadow-blue-800/10">
                {isReplyShowing ? (
                    <button
                        className="btn btn-primary btn-block"
                        onClick={() => {
                            // Add reply to messages
                            setIsTyping(true);

                            // If messages are not completed
                            setMessages([
                                ...messages,
                                {
                                    sender: 'user',
                                    message: shape.introductionMessages[Math.ceil(messages.length / 2) - 1].reply,
                                }
                            ]);
                        }}
                    >
                        {shape.introductionMessages[Math.ceil(messages.length / 2) - 1].reply}
                    </button>
                ) : (
                    <Loading.Button />
                )}
                <button className="btn btn-ghost-primary btn-block">
                    Tutup
                </button>

            </div>

        </main >
    );
};

Introduction.auth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shapeCode = context?.params?.shapeCode || null;
    const shape = shapeCode ? getShape(shapeCode as string) : null;

    return { props: { shape } };
};

export default Introduction;