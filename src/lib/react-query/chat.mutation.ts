import { useMutation } from "@tanstack/react-query";
import { textChat } from "../api/services/chat.service";

export const useTextChatMutation = () => {
  return useMutation({
    mutationFn: (text: string) => textChat(text),
    // You can add onSuccess here to update your local chat state!
  });
};