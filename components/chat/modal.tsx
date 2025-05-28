"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import axios from "axios";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";


export const Modal = () => {

    const { chatId, onClose } = useModal();
    const [ loading, setLoading ] = useState(false);
    const queryClient = useQueryClient();
    
    const handleClose = (open: boolean)=>{
        if(!open) {
            onClose();
        }
    }

    const handleDelete = async()=>{
        try {
            setLoading(true);
            await axios.delete(`/api/chat?id=${chatId}`);
            queryClient.invalidateQueries({
                queryKey : ["chat:get"]
            });
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open = {!!chatId}
            onOpenChange={handleClose}
        >
            <DialogContent className="bg-neutral-800 rounded-xl md:rounded-3xl">
                <DialogHeader className="space-y-4 selection:bg-neutral-50 selection:text-zinc-900">
                    <DialogTitle className="text-xl font-bold">Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your chat
                        and remove your data from database.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full flex items-center justify-end gap-x-3 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-3xl bg-neutral-800 border-neutral-600 hover:bg-neutral-700"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-3xl"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
