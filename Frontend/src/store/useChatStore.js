import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useActionData } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    pendingMessages: new Set(), // Track messages being sent to prevent duplicates

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (receiverId, text, image = null) => {
        try {
            const res = await axiosInstance.post(`/messages/${receiverId}`, {
                text,
                image
            });
            
            // Add the message immediately for the sender
            const { messages } = get();
            set({ messages: [...messages, res.data] });
            
            // Add to pending messages to prevent socket duplicate
            const { pendingMessages } = get();
            pendingMessages.add(res.data._id);
            
            toast.success("Message sent successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    // Socket.io functions (placeholder for now)
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            console.log("New message received:", newMessage);
            const { messages, pendingMessages } = get();
            
            // Check if this message is relevant to the current chat
            const isRelevantMessage = 
                newMessage.senderId === selectedUser._id || 
                newMessage.receiverId === selectedUser._id;
            
            // Check if message already exists or is pending
            const messageExists = messages.some(msg => msg._id === newMessage._id);
            const isPending = pendingMessages.has(newMessage._id);
            
            if (isRelevantMessage && !messageExists && !isPending) {
                set({
                    messages: [...messages, newMessage],
                });
            }
            
            // Remove from pending if it was pending
            if (isPending) {
                pendingMessages.delete(newMessage._id);
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),
}));