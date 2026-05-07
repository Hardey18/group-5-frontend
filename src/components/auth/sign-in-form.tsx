"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
// import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { getUserProfile } from "@/lib/api/services/user-service";
import { useLogin } from "@/lib/react-query/auth.mutations";
import { getUserIdFromToken } from "@/lib/utils/decode-token";
import { useUser } from "@/hooks/use-user";
import { M } from "@/config/mtn-tokens";

const schema = zod.object({
	email: zod.string().min(1, { message: "Email or Username is required" }),
	password: zod.string().min(1, { message: "Password is required" }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: "nurudeen@gmail.com", password: "Secret1" } satisfies Values;

export function SignInForm(): React.JSX.Element {
	const router = useRouter();

	const { checkSession } = useUser();

	const [showPassword, setShowPassword] = React.useState<boolean>();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
	console.log("ERRORS>>>", errors);

	const { mutate: loginUser, isPending } = useLogin();

	const onSubmit = React.useCallback(
		(values: Values): void => {
			loginUser(values, {
				onSuccess: async (data) => {
					console.log("DATA>>>", data);
					const { token } = data;

					// store token
					localStorage.setItem("token", token);

					// decode token → get userId
					const userId = getUserIdFromToken(token);

					// fetch profile
					const userProfile = await getUserProfile(userId);

					// store user
					localStorage.setItem("user", JSON.stringify(userProfile));

					console.log("<<USER>>", userProfile)

					await checkSession?.();

					// if (userProfile === "cus1") {
					// 	router.push("/dashboard/call")
					// } else {
					// 	router.push("/dashboard/dashboard")
					// }
					// router.refresh()
				},
				onError: (error: { message: string }) => {
					setError("root", {
						type: "server",
						message: error.message || "Login failed",
					});
				},
			});
		},
		[loginUser, checkSession, router, setError]
	);

	return (
		<Stack spacing={4}>
			<Stack spacing={1}>
				<Typography variant="h4">Sign in</Typography>
				<Typography color="text.secondary" variant="body2">
					Don&apos;t have an account?{" "}
					<Link href={paths.auth.signUp}>
							Sign up
					</Link>
				</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<FormControl error={Boolean(errors.email)}>
								<InputLabel>Email address</InputLabel>
								<OutlinedInput {...field} label="Email address" />
								{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<FormControl error={Boolean(errors.password)}>
								<InputLabel>Password</InputLabel>
								<OutlinedInput
									{...field}
									endAdornment={
										showPassword ? (
											<EyeIcon
												cursor="pointer"
												fontSize="var(--icon-fontSize-md)"
												onClick={(): void => {
													setShowPassword(false);
												}}
											/>
										) : (
											<EyeSlashIcon
												cursor="pointer"
												fontSize="var(--icon-fontSize-md)"
												onClick={(): void => {
													setShowPassword(true);
												}}
											/>
										)
									}
									label="Password"
									type={showPassword ? "text" : "password"}
								/>
								{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<div>
						<Link href={paths.auth.resetPassword}>
							Forgot password?
						</Link>
					</div>
					{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					<Button disabled={isPending} type="submit" variant="contained" style={{ background: `${M.yellowDark}` }}>
						Sign in
					</Button>
				</Stack>
			</form>
			<Alert color="warning">
				Use your valid{" "}
				<Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
					email
				</Typography>{" "}
				and{" "}
				<Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
					password{" "}
				</Typography>
				to sign in!
			</Alert>
		</Stack>
	);
}
