"use client";

import ReactMarkdown from 'react-markdown';
import { Message } from "@prisma/client";
import { Code } from './code';

interface AIMessageProps {
    message : Message;
}

const preprocessMessage = (content: string) => {
    return content.replace(/<think>([\s\S]*?)<\/think>/g, (match, innerText) => {
        const quotedText = innerText
            .trim()
            .split("\n")
            .map((line: any) => `> ${line}`)
            .join("\n");

        return `\n\n${quotedText}\n\n`;
    });
};

export const AIMessage = ({ message } : AIMessageProps ) => {
    
    const formattedContent = preprocessMessage(message.content);
    
    return (
        <div className="w-full pb-6">
            <ReactMarkdown 
                className='text-zinc-100 leading-relaxed flex flex-col gap-y-5 selection:bg-neutral-50 selection:text-zinc-900'
                components={{
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <Code
                                language={match[1]}
                                code={String(children).replace(/\n$/, '')}
                            />
                        ) : (
                            <div className='py-2 max-md:overflow-x-auto inline'>
                                <code className={`bg-zinc-500/40 text-zinc-100 px-1 rounded-sm ${className}`} {...props}>
                                    {children}
                                </code>
                            </div>
                        );
                    },
                    p({ children }) {
                        return <p className="text-zinc-100">{children}</p>;
                    },
                    strong({ children }) {
                        return <strong className="text-white font-semibold">{children}</strong>;
                    },
                    a({ href, children }) {
                        return <a href={href} className="text-blue-400 hover:underline">{children}</a>;
                    },
                    h1({ children }) {
                        return <h1 className="text-3xl font-extrabold text-white pt-6 pb-3">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="text-2xl font-bold text-white pt-4 pb-2">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="text-xl font-bold text-white pt-2 pb-1">{children}</h3>;
                    },
                    blockquote({ children }) {
                        return <blockquote className="border-l-4 border-zinc-500 pl-4 italic text-zinc-400">{children}</blockquote>;
                    },
                    ul({ children }) {
                        return <ul className="list-disc text-zinc-100 pl-4 flex flex-col gap-y-2">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="list-decimal text-zinc-100 pl-4 flex flex-col gap-y-2">{children}</ol>;
                    },
                    li({ children }) {
                        return <li className="text-zinc-100 ml-4">{children}</li>;
                    },
                }}
            >
                {formattedContent}
            </ReactMarkdown>
            <div>
                <p className="text-xs text-zinc-400 mt-2 px-2 py-1 bg-neutral-800 w-fit rounded-2xl font-medium">{message.model}</p>
            </div>
        </div>
    )
}
