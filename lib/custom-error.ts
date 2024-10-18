// ErrorType Enum
export enum ErrorType {
  RateLimitExceeded = 'RateLimitExceeded',
  Unauthorized = 'Unauthorized',
  InvalidSignature = 'InvalidSignature',
  TransactionSimulationFailed = 'TransactionSimulationFailed',
  TransactionNotFound = 'TransactionNotFound',
  TransactionExpired = 'TransactionExpired',
  TransactionFailed = 'TransactionFailed',
  SlippageExceeded = 'SlippageExceeded',
  InvalidInput = 'InvalidInput',
  ExternalApiError = 'ExternalApiError',
  InsufficientFunds = 'InsufficientFunds',
  TokenAccountError = 'TokenAccountError',
  BlockchainError = 'BlockchainError',
  NetworkError = 'NetworkError',
  NotFound = 'NotFound',
  SolanaError = 'SolanaError',
  PaymentError = 'PaymentError',
  WalletNotFound = 'WalletNotFound',
  AccountNotFound = 'AccountNotFound',
  UserNotFound = 'UserNotFound',
  InvalidUserId = 'InvalidUserId',
  BlinkCreationFailed = 'BlinkCreationFailed',
  BlinkNotFound = 'BlinkNotFound',
  InvalidBlinkData = 'InvalidBlinkData',
  NFTMintFailed = 'NFTMintFailed',
  NFTNotFound = 'NFTNotFound',
  InvalidNFTData = 'InvalidNFTData',
  NFTTransferFailed = 'NFTTransferFailed',
  InvalidCredentials = 'InvalidCredentials',
  UserAlreadyExists = 'UserAlreadyExists',
  InvalidAction = 'InvalidAction',
  ConfigurationError = 'ConfigurationError',
}

// CustomError Class
export class CustomError extends Error {
  constructor(public type: ErrorType, message: string, public originalError?: unknown) {
    super(message);
    this.name = 'CustomError';

    // Log the original error for debugging
    if (originalError) {
      console.error('Original error:', originalError);
    }
  }

  get statusCode(): number {
    switch (this.type) {
      case ErrorType.RateLimitExceeded:
        return 429; // Too Many Requests
      case ErrorType.Unauthorized:
      case ErrorType.InvalidSignature:
      case ErrorType.InvalidCredentials:
        return 401; // Unauthorized
      case ErrorType.TransactionSimulationFailed:
      case ErrorType.TransactionNotFound:
      case ErrorType.TransactionExpired:
      case ErrorType.TransactionFailed:
      case ErrorType.SlippageExceeded:
      case ErrorType.InsufficientFunds:
      case ErrorType.TokenAccountError:
      case ErrorType.BlinkCreationFailed:
      case ErrorType.InvalidBlinkData:
      case ErrorType.NFTMintFailed:
      case ErrorType.InvalidNFTData:
      case ErrorType.NFTTransferFailed:
      case ErrorType.InvalidAction:
        return 400; // Bad Request
      case ErrorType.InvalidInput:
        return 422; // Unprocessable Entity
      case ErrorType.ExternalApiError:
      case ErrorType.NetworkError:
        return 503; // Service Unavailable
      case ErrorType.BlockchainError:
        return 502; // Bad Gateway
      case ErrorType.NotFound:
      case ErrorType.WalletNotFound:
      case ErrorType.AccountNotFound:
      case ErrorType.UserNotFound:
      case ErrorType.InvalidUserId:
      case ErrorType.BlinkNotFound:
      case ErrorType.NFTNotFound:
        return 404; // Not Found
      case ErrorType.SolanaError:
      case ErrorType.ConfigurationError:
        return 500; // Internal Server Error
      case ErrorType.PaymentError:
        return 402; // Payment Required
      case ErrorType.UserAlreadyExists:
        return 409; // Conflict
      default:
        return 500; // Internal Server Error
    }
  }

  toJSON() {
    return {
      error: this.type,
      message: this.message,
      statusCode: this.statusCode,
      originalError: this.originalError instanceof Error ? this.originalError.message : undefined,
      stack: this.originalError instanceof Error ? this.originalError.stack : undefined,
    };
  }
}
