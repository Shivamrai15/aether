"use client";

import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormItem,
    FormField
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputType, InputSchema } from "@/schemas/input.schema";



export const MessageBox = () => {
    
    const form = useForm<InputType>({
        resolver : zodResolver(InputSchema),
        defaultValues : {
            content : ""
        }
    });

    return (
        <Form {...form} >
            <form
                className='w-full bg-neutral-800 p-1 rounded-2xl'
            >
                <FormField
                    control={form.control}
                    name="content"  
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
            </form>
        </Form>
    )
}
