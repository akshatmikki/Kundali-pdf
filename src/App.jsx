import * as React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Container,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AstroPDF from "./AstroPDF";

export default function LoginPage() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleLogin = () => {
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Please enter both username and password!");
      return;
    }

    if (username === "TAstro" && password === "V@dic#123") {
      setLoggedIn(true);
    } else {
      setErrorMessage("Invalid username or password! (Hint: admin/admin)");
    }
  };

  if (loggedIn) {
    return <AstroPDF />;
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #d8b4fe, #fbcfe8, #fed7aa)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          borderRadius: 4,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Logo Section */}
        <Box sx={{ mb: 3 }}>
          {/* If you have a logo image, replace the Box below with <img src="/your-logo.png" alt="logo" /> */}
          <img src="/logo.png" alt="Logo" style={{ width: 90, height: 90, borderRadius: "50%", marginBottom: 8 }} />
          <Typography variant="h5" fontWeight="bold" color="secondary">
            TrustAstrology
          </Typography>
        </Box>

        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Username Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />

        {/* Password Field */}
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
          onClick={handleLogin}
        >
          Secure Login
        </Button>
      </Paper>
    </Container>
  );
}
