"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PhoneCall, Warning } from "@phosphor-icons/react";

import { ComplaintPipelineResponse } from "@/types/call-pipeline";
import { M } from "@/config/mtn-tokens";
import { api } from "@/lib/api/axios";

import { ProcessingScreen } from "./components/ProcessingScreen";
import { RecordingPanel } from "./components/RecordingPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { StartCallCard } from "./components/StartCallCard";

// import { D } from "./config/call-design-tokens";
// import { D } from "./components/call-design-tokens";

type Stage = "START" | "RECORDING" | "PROCESSING" | "RESULTS";

const STAGE_LABELS: Record<Stage, string> = {
	START: "New Call",
	RECORDING: "Recording",
	PROCESSING: "Processing",
	RESULTS: "Results",
};

const STAGES: Stage[] = ["START", "RECORDING", "PROCESSING", "RESULTS"];

export default function CallPage() {
	const [stage, setStage] = useState<Stage>("START");
	const [callId, setCallId] = useState<string | null>(null);
	const [results, setResults] = useState<ComplaintPipelineResponse | null>(null);
	const [errorLocal, setErrorLocal] = useState<string | null>(null);

	const handleCallStarted = (id: string) => {
		setCallId(id);
		setStage("RECORDING");
	};

	const handleStopRecording = async (fullAudioBlob: Blob) => {
		setStage("PROCESSING");
		setErrorLocal(null);
		try {
			const formData = new FormData();
			formData.append("audioFile", fullAudioBlob, "complaint.webm");
			const res = await api.post("/ai/process-complaint", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data?.success) {
				setResults(res.data.data);
				setStage("RESULTS");
			} else {
				throw new Error(res.data?.message || "Failed to process audio");
			}
		} catch (err: any) {
			console.error(err);
			setErrorLocal(err.message || "An error occurred during AI processing.");
			setStage("START");
		}
	};

	const handleReset = () => {
		setCallId(null);
		setResults(null);
		setErrorLocal(null);
		setStage("START");
	};

	const currentStageIndex = STAGES.indexOf(stage);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: M.bg,
				fontFamily: "'Outfit', 'Nunito', sans-serif",
				backgroundImage: `
          radial-gradient(ellipse 55% 35% at 10% 0%, #00C9B108 0%, transparent 55%),
          radial-gradient(ellipse 40% 25% at 90% 100%, #818CF808 0%, transparent 50%)
        `,
			}}
		>
			{/* ── Header ─────────────────────────────────────────────────────────── */}
			<Box
				sx={{
					borderBottom: `1px solid ${M.border}`,
					px: { xs: 3, md: 5 },
					py: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					position: "sticky",
					top: 0,
					zIndex: 100,
					bgcolor: `${M.bg}D8`,
					backdropFilter: "blur(14px)",
				}}
			>
				{/* Brand */}
				{/* <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${M.teal}22, ${M.indigo}22)`,
              border: `1px solid ${M.teal}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneCall size={16} color={M.teal} weight="fill" />
          </Box>
          <Box>
            <Typography sx={{ color: M.text, fontWeight: 800, fontSize: "0.95rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
              Complaint Call
            </Typography>
            <Typography sx={{ color: M.textMuted, fontSize: "0.6rem", letterSpacing: "0.12em" }}>
              AI-POWERED PIPELINE
            </Typography>
          </Box>
        </Stack> */}

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
							<PhoneCall sx={{ color: M.black, fontSize: "1.15rem" }} />
						</Box>
						<Box>
							<Typography
								sx={{ fontWeight: 800, fontSize: "1rem", color: M.black, lineHeight: 1, letterSpacing: "-0.01em" }}
							>
								Complaint Call
							</Typography>
							<Typography sx={{ color: M.textMuted, fontSize: "0.6rem", letterSpacing: "0.12em" }}>
								AI-POWERED PIPELINE
							</Typography>
						</Box>
					</Stack>
				</Stack>

				{/* Stage breadcrumb */}
				<Stack direction="row" alignItems="center" spacing={0.5}>
					{STAGES.map((s, i) => {
						const done = i < currentStageIndex;
						const active = i === currentStageIndex;
						return (
							<React.Fragment key={s}>
								<Box
									sx={{
										px: 1.25,
										py: 0.3,
										borderRadius: "20px",
										bgcolor: active ? `${M.yellowDeep}18` : done ? `${M.yellowDark}10` : "transparent",
										border: `1px solid ${active ? M.yellowDark + "44" : done ? M.yellowDark + "30" : "transparent"}`,
									}}
								>
									<Typography
										sx={{
											fontSize: "0.65rem",
											fontWeight: 700,
											letterSpacing: "0.06em",
											color: M.yellowDark,
										}}
									>
										{STAGE_LABELS[s]}
									</Typography>
								</Box>
								{i < STAGES.length - 1 && (
									<Box sx={{ width: 12, height: 1, bgcolor: done ? M.yellowDark + "40" : M.border }} />
								)}
							</React.Fragment>
						);
					})}
				</Stack>
			</Box>

			{/* ── Body ───────────────────────────────────────────────────────────── */}
			<Container maxWidth="md" sx={{ py: 5 }}>
				{/* Global error */}
				{errorLocal && (
					<Fade in timeout={400}>
						<Box
							sx={{
								display: "flex",
								alignItems: "flex-start",
								gap: 1.5,
								bgcolor: `${M.rose}12`,
								border: `1px solid ${M.rose}33`,
								borderRadius: "12px",
								px: 2.5,
								py: 2,
								mb: 4,
							}}
						>
							<Warning size={16} color={M.rose} weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
							<Box>
								<Typography sx={{ color: M.rose, fontWeight: 700, fontSize: "0.8rem", mb: 0.25 }}>
									Processing Failed
								</Typography>
								<Typography sx={{ color: M.rose + "CC", fontSize: "0.75rem", lineHeight: 1.5 }}>
									{errorLocal}
								</Typography>
							</Box>
						</Box>
					</Fade>
				)}

				{stage === "START" && (
					<Fade in timeout={500}>
						<Box>
							<StartCallCard onCallStarted={handleCallStarted} />
						</Box>
					</Fade>
				)}

				{stage === "RECORDING" && callId && (
					<Fade in timeout={500}>
						<Box>
							<RecordingPanel callId={callId} onStop={handleStopRecording} />
						</Box>
					</Fade>
				)}

				{stage === "PROCESSING" && (
					<Fade in timeout={500}>
						<Box>
							<ProcessingScreen />
						</Box>
					</Fade>
				)}

				{stage === "RESULTS" && results && (
					<Fade in timeout={500}>
						<Box>
							<ResultsPanel data={results} onReset={handleReset} />
						</Box>
					</Fade>
				)}
			</Container>
		</Box>
	);
}

// "use client";

// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import Fade from "@mui/material/Fade";
// import Alert from "@mui/material/Alert";

// import { StartCallCard } from "./components/StartCallCard";
// import { RecordingPanel } from "./components/RecordingPanel";
// import { ProcessingScreen } from "./components/ProcessingScreen";
// import { ResultsPanel } from "./components/ResultsPanel";

// import { api } from "@/lib/api/axios";
// import { ComplaintPipelineResponse } from "@/types/call-pipeline";

// type Stage = "START" | "RECORDING" | "PROCESSING" | "RESULTS";

// export default function CallPage() {
//   const [stage, setStage] = useState<Stage>("START");
//   const [callId, setCallId] = useState<string | null>(null);
//   const [results, setResults] = useState<ComplaintPipelineResponse | null>(null);
//   const [errorLocal, setErrorLocal] = useState<string | null>(null);

//   const handleCallStarted = (id: string) => {
//     setCallId(id);
//     setStage("RECORDING");
//   };

//   const handleStopRecording = async (fullAudioBlob: Blob) => {
//     setStage("PROCESSING");
//     setErrorLocal(null);

//     try {
//       const formData = new FormData();
//       formData.append("audioFile", fullAudioBlob, "complaint.webm");

//       const res = await api.post("/ai/process-complaint", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data?.success) {
//         setResults(res.data.data);
//         setStage("RESULTS");
//       } else {
//         throw new Error(res.data?.message || "Failed to process audio");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setErrorLocal(err.message || "An error occurred during AI processing.");
//       setStage("START");
//     }
//   };

//   const handleReset = () => {
//     setCallId(null);
//     setResults(null);
//     setErrorLocal(null);
//     setStage("START");
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 6 }}>

//       {errorLocal && (
//         <Alert severity="error" sx={{ mb: 4 }}>
//           {errorLocal}
//         </Alert>
//       )}

//       {stage === "START" && (
//         <Fade in timeout={500}>
//           <Box>
//             <StartCallCard onCallStarted={handleCallStarted} />
//           </Box>
//         </Fade>
//       )}

//       {stage === "RECORDING" && callId && (
//         <Fade in timeout={500}>
//           <Box>
//             <RecordingPanel callId={callId} onStop={handleStopRecording} />
//           </Box>
//         </Fade>
//       )}

//       {stage === "PROCESSING" && (
//         <Fade in timeout={500}>
//           <Box>
//             <ProcessingScreen />
//           </Box>
//         </Fade>
//       )}

//       {stage === "RESULTS" && results && (
//         <Fade in timeout={500}>
//           <Box>
//             <ResultsPanel data={results} onReset={handleReset} />
//           </Box>
//         </Fade>
//       )}

//     </Container>
//   );
// }
