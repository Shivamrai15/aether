import * as z from "zod";

export const InputSchema = z.object({
    chatId : z.string().optional(),
    input : z.string().min(1)
});

export type InputType = z.infer<typeof InputSchema>;