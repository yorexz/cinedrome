import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AlertCircle } from 'lucide-react';

const ErrorCardWrapper = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
  border: '1px solid rgba(255, 0, 0, 0.3)',
}));

const ErrorCard = ({ message = "Erro ao carregar o filme" }) => (
  <ErrorCardWrapper>
    <AlertCircle color="red" size={32} />
    <Box mt={1}>
      <Typography color="error" align="center" variant="body2">
        {message}
      </Typography>
    </Box>
  </ErrorCardWrapper>
);

export default ErrorCard;