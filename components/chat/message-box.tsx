"use client";

import { useParams } from "next/navigation";
import { v4 as uuidv4} from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormItem,
    FormField,
    FormMessage
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { HiPaperAirplane } from "react-icons/hi2";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputType, InputSchema } from "@/schemas/input.schema";


export const MessageBox = () => {

    const params = useParams();
    const queryClient = useQueryClient();
    
    const chatId = params["chatId"] as string;

    const form = useForm<InputType>({
        resolver : zodResolver(InputSchema),
        defaultValues : {
            input : "",
            chatId : chatId || uuidv4(),
            newChat : chatId ? false : true
        }
    });

    const { isValid, isSubmitting } = form.formState;


    const onSubmit = async(values: InputType)=>{
        try {

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
                queryKey : ["chat:get"]
            });

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Form {...form} >
            <form
                className='w-full bg-neutral-800 p-1 rounded-2xl transition-all duration-300'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="input"  
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    className="min-h-20 h-auto max-h-36 font-medium overflow-auto bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-zinc-100"
                                    placeholder="Message Aether"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className='flex items-center justify-end p-3'>
                    {
                       isValid && (
                            <Button 
                                type="submit"
                                size="icon"
                                className="rounded-full shadow-md shadow-neutral-900"
                                disabled={!isValid || isSubmitting}
                            >
                                <HiPaperAirplane className="size-5"/>
                            </Button>
                        ) 
                    }
                </div>
            </form>
        </Form>
    )
}
