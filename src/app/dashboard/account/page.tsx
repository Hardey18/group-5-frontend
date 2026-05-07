import * as React from "react";
import type { Metadata } from "next";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { config } from "@/config";
import { M } from "@/config/mtn-tokens";
import { AccountDetailsForm } from "@/components/dashboard/account/account-details-form";
import { AccountInfo } from "@/components/dashboard/account/account-info";

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<div>
				{/* <Typography variant="h4">Account</Typography> */}
				<Stack direction="row" alignItems="center" spacing={2}>
					<Box sx={{ width: 5, bgcolor: M.yellow, alignSelf: "stretch" }} />
					<Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 2 }}>
						<Box
							sx={{
								width: 36,
								height: 36,
								borderRadius: "9px",
								bgcolor: M.yellow,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<UserIcon sx={{ color: M.black, fontSize: "1.15rem" }} />
						</Box>
						<Box>
							<Typography
								sx={{ fontWeight: 800, fontSize: "1rem", color: M.black, lineHeight: 1, letterSpacing: "-0.01em" }}
							>
								Account
							</Typography>
							<Typography sx={{ color: M.textMuted, fontSize: "0.6rem", letterSpacing: "0.12em" }}>
								USER ACCOUNT
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</div>
			<Grid container spacing={3}>
				<Grid
					size={{
						lg: 4,
						md: 6,
						xs: 12,
					}}
				>
					<AccountInfo />
				</Grid>
				<Grid
					size={{
						lg: 8,
						md: 6,
						xs: 12,
					}}
				>
					<AccountDetailsForm />
				</Grid>
			</Grid>
		</Stack>
	);
}
