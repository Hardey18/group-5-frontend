import { api } from "../axios";

export const textChat = async (text: string) => {
	const res = await api.post("/ai/text-to-text", { text });
	return res.data;
};
