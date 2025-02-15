"use client";

import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormItem,
    FormField,
    FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputType, InputSchema } from "@/schemas/input.schema";
import { Button } from '@/components/ui/button';


interface MessageBoxProps {
    chatId?: string;
}

export const MessageBox = ({
    chatId
}: MessageBoxProps  ) => {

    const queryClient = useQueryClient();

    const form = useForm<InputType>({
        resolver : zodResolver(InputSchema),
        defaultValues : {
            input : "",
            chatId : chatId|| uuidv4(),
            newChat : chatId ? false : true
        }
    });

    const onSubmit = async(values: InputType)=>{
        try {
            
            console.log("API Called");

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
          
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    console.log("Received chunk:", chunk);
                }
            }

            await queryClient.invalidateQueries({
                queryKey : ["chats:all"]
            });

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Form {...form} >
            <form
                className='w-full bg-neutral-800 p-1 rounded-2xl'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="input"  
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    className="h-28 font-medium overflow-y-auto bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-zinc-100"
                                    placeholder="Message Aether"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className='flex items-center justify-end'>
                    <Button type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    )
}
