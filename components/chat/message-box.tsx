"use client";

import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form";
import axios from "axios";

import {
    Form,
    FormControl,
    FormItem,
    FormField
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
    
    const form = useForm<InputType>({
        resolver : zodResolver(InputSchema),
        defaultValues : {
            input : "",
            chatId : chatId|| uuidv4()
        }
    });

    const onSubmit = async(values: InputType)=>{
        try {
            
            const response = await axios.post("/api/chat", values);
            console.log(response.data);

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
