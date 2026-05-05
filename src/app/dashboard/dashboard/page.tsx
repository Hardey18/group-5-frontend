"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function ClientDashboardPage(): React.JSX.Element {
	return (
		<Stack spacing={4}>
			<div>
				<Typography variant="h4">Dashboard</Typography>
				<iframe
					title="Cx Insight"
					width="1140"
					height="541.25"
					src="https://app.powerbi.com/reportEmbed?reportId=c45d7646-bbc1-4b7a-9b4e-6135f7b60b90&autoAuth=true&ctid=9eb558d5-593e-4ead-b5e4-3fae304735ed"
					// frameborder="0"
					allowFullScreen={true}
				></iframe>
			</div>
		</Stack>
	);
}
