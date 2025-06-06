"use client";

import { use, useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4} from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormItem,
    FormField,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { HiPaperAirplane } from "react-icons/hi2";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputType, InputSchema } from "@/schemas/input.schema";
import { useMessage } from "@/hooks/use-message";
import { Role } from "@prisma/client";
import { useThinking } from "@/hooks/use-thinking";
import { useModel } from "@/hooks/use-models";
import { cn } from "@/lib/utils";


export const MessageBox = () => {

    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const { currentModel, useEmbeddedModel, setUseEmbeddedModel } = useModel();
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const { createMessage, updateMessage, getMessages } = useMessage();
    const { setLoadingId } = useThinking();
    
    const [chatId, setChatId] = useState(params["chatId"] as string ||"");

    const form = useForm<InputType>({
        resolver : zodResolver(InputSchema),
        defaultValues : {
            input : "",
            chatId : chatId || uuidv4(),
            newChat : chatId ? false : true,
            model : currentModel
        }
    });

    useEffect(()=>{
        if (currentModel) {
            form.setValue("model", currentModel);
        }
    }, [currentModel, form]);

    useEffect(()=>{
        const id = params["chatId"] as string | undefined;
        if (id) {
            setChatId(id);
            form.reset({
                input: "",
                chatId: id,
                newChat: false,
                model : currentModel
            });
        } else {
            setChatId("");
            form.reset({
                input: "",
                chatId: uuidv4(),
                newChat: true,
                model : currentModel
            });
        }
    }, [pathname, params]);

    const { isValid, isSubmitting } = form.formState;


    const onSubmit = async(values: InputType)=>{
        try {

            form.reset();

            if ( values.newChat ) {
                router.push(`/${useEmbeddedModel?'e':'c'}/${values.chatId}`);
            }

            createMessage({
                id : uuidv4(),
                chatId : values.chatId,
                content : values.input,
                role : Role.USER,
                timestamp : new Date(),
                model : currentModel
            });

            const aiMessageId = uuidv4();

            setLoadingId(values.chatId);

            if (useEmbeddedModel) {
                const response = await fetch("/api/embeddeding", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                createMessage(data);
                setLoadingId("");
                queryClient.invalidateQueries({
                    queryKey : ["chat:get"]
                });

            } else {

                createMessage({
                    id : aiMessageId,
                    chatId : values.chatId,
                    content : "",
                    role : Role.ASSISTANT,
                    timestamp : new Date(Date.now()+50),
                    model : currentModel
                });

                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                if (!response.body) {
                    console.error("ReadableStream not supported in this browser.");
                    return;
                }
            
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let done = false;

                setLoadingId("");
                queryClient.invalidateQueries({
                    queryKey : ["chat:get"]
                });

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) {
                        const chunk = decoder.decode(value, { stream: true });
                        updateMessage(chunk, aiMessageId ,values.chatId);
                        getMessages(values.chatId);
                    }
                }
            }

            

        } catch (error) {
            console.log(error);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            form.handleSubmit(onSubmit)();
        }
    }

    useEffect(() => {
        if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [form.watch("input")]);


    return (
        <Form {...form} >
            <form
                className='w-full bg-neutral-800 p-1 mt-1 rounded-3xl transition-all duration-300 ring-1 ring-neutral-700'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="input"  
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    className="min-h-8 max-h-36 font-medium text-base overflow-auto bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-zinc-100"
                                    placeholder="Message Aether"
                                    {...field}
                                    disabled={!currentModel}
                                    ref={textareaRef}
                                    onKeyDown={handleKeyDown}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className='flex items-center justify-between p-2 px-3'>
                    <div className="flex items-center gap-x-4">
                        <Button
                            type="button"
                            className={cn(
                                "rounded-full bg-transparent border-zinc-500 hover:bg-neutral-700",
                                useEmbeddedModel && "bg-neutral-700"
                            )}
                            size="sm"
                            variant="outline"
                            onClick={() => setUseEmbeddedModel(!useEmbeddedModel)}
                        >
                            Embeddings
                        </Button>
                    </div>
                    <Button 
                        type="submit"
                        size="icon"
                        className="rounded-full shadow-md shadow-neutral-900"
                        disabled={!isValid || isSubmitting || !currentModel}
                    >
                        <HiPaperAirplane className="size-5"/>
                    </Button>
                </div>
            </form>
        </Form>
    )
}
