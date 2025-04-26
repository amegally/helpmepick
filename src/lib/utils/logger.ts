const isDevelopment = process.env.NODE_ENV === 'development';

const sanitizeError = (error: unknown): string => {
  if (error instanceof Error) {
    // Only return the message in production, full stack trace in development
    return isDevelopment ? error.stack || error.message : error.message;
  }
  return String(error);
};

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // In production, only log sanitized error messages
      console.error(message, error ? sanitizeError(error) : '');
    }
  },
  
  info: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(message, data);
    }
    // Don't log info in production
  },

  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.debug(message, data);
    }
    // Don't log debug in production
  }
}; 