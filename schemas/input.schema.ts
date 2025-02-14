import * as z from "zod";

export const InputSchema = z.object({
    content : z.string().min(1)
});

export type InputType = z.infer<typeof InputSchema>;