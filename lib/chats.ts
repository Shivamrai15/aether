import { Chat } from "@prisma/client";
import { format, isToday, isYesterday, subDays, isWithinInterval } from "date-fns";

export const groupChatsByDate = (chats: Chat[]) => {
    const today: Chat[] = [];
    const yesterday: Chat[] = [];
    const last7Days: Chat[] = [];
    const last30Days: Chat[] = [];
    const monthly: Record<string, Chat[]> = {};

    const now = new Date();

    chats.forEach((chat) => {
        const date = new Date(chat.createdAt);
        if (isToday(date)) {
            today.push(chat);
        } else if (isYesterday(date)) {
            yesterday.push(chat);
        } else if (isWithinInterval(date, { start: subDays(now, 7), end: now })) {
            last7Days.push(chat);
        } else if (isWithinInterval(date, { start: subDays(now, 30), end: now })) {
            last30Days.push(chat);
        } else {
            const monthKey = format(date, "MMMM yyyy");
            if (!monthly[monthKey]) {
                monthly[monthKey] = [];
            }
            monthly[monthKey].push(chat);
        }
    });

    return { today, yesterday, last7Days, last30Days, monthly };
};
