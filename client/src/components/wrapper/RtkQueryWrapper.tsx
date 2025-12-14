import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FC } from "react";

interface IRtkQueryWrapperProps {
  /**
   * Pass isLoading and IsUninitialized from an RTK Query hook
   */
  isLoading: boolean;
  children: React.ReactNode;
  texts: {
    loading: string;
    createMessage: string;
    noData: string;
    fetchError: string;
  };
  /**
   * Check array length to determine if there is data
   */
  data?: any[];
  error?: FetchBaseQueryError | SerializedError;
  isFetching?: boolean;
  onCreate?: () => void;
}

export const RtkQueryWrapper: FC<IRtkQueryWrapperProps> = ({
  isLoading,
  data,
  children,
  error,
  isFetching,
  texts: { loading, createMessage, noData, fetchError },
  onCreate,
}) => {
  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {loading}
          </Typography>
        </Container>
      </Container>
    );
  } else if (error) {
    return <Alert severity="error">{fetchError}</Alert>;
  } else if (data?.length === 0 && !isFetching) {
    return (
      <Alert
        severity="info"
        action={<Button onClick={onCreate}>{createMessage}</Button>}
      >
        {noData}
      </Alert>
    );
  }
  return <>{children}</>;
};
