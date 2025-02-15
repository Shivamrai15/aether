import * as z from "zod";

export const InputSchema = z.object({
    chatId : z.string().min(1),
    input : z.string().min(1),
    newChat : z.boolean()
});

export type InputType = z.infer<typeof InputSchema>;