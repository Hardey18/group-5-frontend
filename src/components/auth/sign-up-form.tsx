"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { useRegister } from "@/lib/react-query/auth.mutations";

const schema = zod.object({
	name: zod.string().min(1, { message: "Name is required" }),
	email: zod.string().min(1, { message: "Email is required" }).email(),
	password: zod.string().min(6, { message: "Password should be at least 6 characters" }),
	confirmPassword: zod.string().min(6, { message: "Password should be at least 6 characters" }),
	phoneNumber: zod.string().min(1, { message: "Name is required" }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { name: "", email: "", password: "", confirmPassword: "", phoneNumber: "" } satisfies Values;

export function SignUpForm(): React.JSX.Element {
	const router = useRouter();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	const { mutate: registerUser, isPending } = useRegister();

	const onSubmit = React.useCallback(
		(values: Values): void => {
			registerUser(values, {
				onSuccess: async (data) => {
					console.log("DATA>>>", data);
					router.refresh();
					router.push("/auth/login");
				},
				onError: (error: any) => {
					console.log("ERROR", error);
					setError("root", {
						type: "server",
						message: error.message || "Register failed",
					});
				},
			});
		},
		[registerUser, router, setError]
	);

	return (
		<Stack spacing={3}>
			<Stack spacing={1}>
				<Typography variant="h4">Sign up</Typography>
				<Typography color="text.secondary" variant="body2">
					Already have an account?{" "}
					<Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
						Sign in
					</Link>
				</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<FormControl error={Boolean(errors.name)}>
								<InputLabel>Name</InputLabel>
								<OutlinedInput {...field} label="First name" />
								{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<FormControl error={Boolean(errors.email)}>
								<InputLabel>Email address</InputLabel>
								<OutlinedInput {...field} label="Email address" type="email" />
								{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
          <Controller
						control={control}
						name="phoneNumber"
						render={({ field }) => (
							<FormControl error={Boolean(errors.phoneNumber)}>
								<InputLabel>Phone Number</InputLabel>
								<OutlinedInput {...field} label="Phone Number" />
								{errors.phoneNumber ? <FormHelperText>{errors.phoneNumber.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<FormControl error={Boolean(errors.password)}>
								<InputLabel>Password</InputLabel>
								<OutlinedInput {...field} label="Password" type="password" />
								{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="confirmPassword"
						render={({ field }) => (
							<FormControl error={Boolean(errors.confirmPassword)}>
								<InputLabel>Confirm Password</InputLabel>
								<OutlinedInput {...field} label="Confirm Password" type="password" />
								{errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					<Button disabled={isPending} type="submit" variant="contained">
						Sign up
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}
