"use client";

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';

interface CodeHighlighterProps {
    language: string;
    code: string;
}

export const Code = ({
    language,
    code
}: CodeHighlighterProps ) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <div className='relative py-6'>
            <div className='overflow-x-auto rounded-md'>
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                >
                    {code}
                </SyntaxHighlighter>
            </div>
            <Button
                className='absolute top-11 right-3 p-2 h-7 bg-neutral-900'
                onClick={handleCopy}
                variant="outline"
            >
                {
                    copied ? <CheckIcon className='size-3'/> : <CopyIcon className='size-3'/>
                }
            </Button>
        </div>
    )
}
