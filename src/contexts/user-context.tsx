"use client";

import * as React from "react";

import type { User } from "@/types/user";
import { logger } from "@/lib/default-logger";

export interface UserContextValue {
	user: User | null;
	error: string | null;
	isLoading: boolean;
	checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
	children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
	const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
		user: null,
		error: null,
		isLoading: true,
	});

	const checkSession = React.useCallback(async (): Promise<void> => {
		try {
			const storedUser = localStorage.getItem("user");

			if (!storedUser) {
				setState({ user: null, error: null, isLoading: false });
				return;
			}

			const user = JSON.parse(storedUser);

			setState({
				user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			logger.error(error);

			setState({
				user: null,
				error: "Something went wrong",
				isLoading: false,
			});
		}
	}, []);

	React.useEffect(() => {
		checkSession().catch((error) => {
			logger.error(error);
			// noop
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
	}, []);

	return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
