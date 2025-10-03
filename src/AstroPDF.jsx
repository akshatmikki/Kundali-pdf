import { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";
import { generateFullCosmicReport } from "./CosmicDMReport.jsx";

export default function AstroPDF() {
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [place, setPlace] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #4c1d95, #9333ea, #ec4899)",
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{ p: 4, borderRadius: 3, width: "100%" }}
      >
        {/* Logo + Title */}
        <Box textAlign="center" mb={4}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 8 }}
          />
          <Typography variant="h5" fontWeight="bold" color="purple">
            TrustAstrology
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate Your Cosmic Report
          </Typography>
        </Box>

        {/* Personal Details */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" color="purple" mb={1}>
            Personal Details
          </Typography>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            margin="dense"
          />
        </Box>

        {/* Birth Details */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" color="purple" mb={1}>
            Birth Details
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="number"
            label="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            type="number"
            label="Longitude"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            margin="dense"
          />
        </Box>

        {/* Generate Button */}
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{
            py: 1.5,
            mt: 1,
            background: "linear-gradient(to right, #9333ea, #ec4899)",
          }}
          onClick={async () => {
            if (!dob || !time || !lat || !lon || !name || !sex || !place || !state || !country) {
              alert("Please fill in all fields!");
              return;
            }
            setLoading(true);
            const userData = { name, sex, dob, time, place, state, country };
            await generateFullCosmicReport(dob, time, lat, lon, userData);
            setLoading(false);
          }}
        >
          {loading ? "Generating..." : "Generate Full Cosmic Report PDF"}
        </Button>
      </Paper>
    </Container>
  );
}
