"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Controller, useForm } from "react-hook-form";

import { useUpdateProfile } from "@/lib/react-query/user.mutation";
import { useCurrentUser } from "@/lib/react-query/user.queries";
import { M } from "@/config/mtn-tokens";

type FormValues = {
	fullName: string;
	email: string;
	phoneNumber: string;
	userName: string;
};

export function AccountDetailsForm(): React.JSX.Element {
	const { data: user } = useCurrentUser();

	const { mutate: updateUser, isPending } = useUpdateProfile();

	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			fullName: "",
			email: "",
			phoneNumber: "",
			userName: "",
		},
	});

	// 🔥 Sync form with fetched user
	React.useEffect(() => {
		if (user) {
			reset({
				fullName: user.fullName || "",
				email: user.email || "",
				phoneNumber: user.phoneNumber || "",
				userName: user.userName || "",
			});
		}
	}, [user, reset]);
	console.log("USER>>>", user);

	const onSubmit = (values: FormValues) => {
		console.log("FORM VALUES", values);
		updateUser(
			{
				userId: user.userId,
				fullName: values.fullName,
				phoneNumber: values.phoneNumber,
				profilePhotoUrl: "https://as1.ftcdn.net/v2/jpg/11/41/78/70/1000_F_1141787063_lIVnG17OvyVcWz9udRvoQQ69iZA4ODMK.jpg",
			},
			{
				onSuccess: () => {
					const updatedUser = {
						...user,
						fullName: values.fullName,
						phoneNumber: values.phoneNumber,
					};

					localStorage.setItem("user", JSON.stringify(updatedUser));
				},
			}
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardHeader subheader="The information can be edited" title="Profile" />
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Controller
							name="fullName"
							control={control}
							render={({ field }) => (
								<FormControl fullWidth required>
									<InputLabel>Name</InputLabel>
									<OutlinedInput {...field} value={field.value || ""} label="Name" />
								</FormControl>
							)}
						/>
						<Controller
							name="userName"
							control={control}
							render={({ field }) => (
								<FormControl fullWidth required>
									<InputLabel>User Name</InputLabel>
									<OutlinedInput {...field} label="User Name" value={field.value || ""} disabled />
								</FormControl>
							)}
						/>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<FormControl fullWidth required>
									<InputLabel>Email Address</InputLabel>
									<OutlinedInput {...field} value={field.value || ""} label="Email" disabled />
								</FormControl>
							)}
						/>
						<Controller
							name="phoneNumber"
							control={control}
							render={({ field }) => (
								<FormControl fullWidth>
									<InputLabel>Phone</InputLabel>
									<OutlinedInput {...field} value={field.value || ""} label="Phone" />
								</FormControl>
							)}
						/>
					</Grid>
				</CardContent>
				<Divider />
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button type="submit" disabled={isPending} variant="contained" style={{background: `${M.yellowDark}`}}>
						{isPending ? "Saving..." : "Save details"}
					</Button>
				</CardActions>
			</Card>
		</form>
	);
}
