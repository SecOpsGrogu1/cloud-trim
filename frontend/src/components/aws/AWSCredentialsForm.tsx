import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

interface Props {
  onSubmit: (credentials: AWSCredentials) => void;
}

const AWSCredentialsForm: React.FC<Props> = ({ onSubmit }) => {
  const [credentials, setCredentials] = useState<AWSCredentials>({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
  });
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof AWSCredentials) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Basic validation
    if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.region) {
      setError('All fields are required');
      return;
    }

    // Submit credentials
    onSubmit(credentials);
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom>
        Connect AWS Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your AWS credentials to start optimizing your cloud costs. Your credentials
        are securely stored and used only for accessing your AWS resources.
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="AWS Access Key ID"
            value={credentials.accessKeyId}
            onChange={handleChange('accessKeyId')}
            fullWidth
            required
          />

          <TextField
            label="AWS Secret Access Key"
            type={showSecret ? 'text' : 'password'}
            value={credentials.secretAccessKey}
            onChange={handleChange('secretAccessKey')}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowSecret(!showSecret)}
                    edge="end"
                  >
                    {showSecret ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="AWS Region"
            value={credentials.region}
            onChange={handleChange('region')}
            fullWidth
            required
            helperText="e.g., us-east-1, us-west-2"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Connect AWS Account
          </Button>
        </Box>
      </form>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </StyledPaper>
  );
};

export default AWSCredentialsForm;
