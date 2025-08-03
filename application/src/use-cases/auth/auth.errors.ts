import { BaseError } from '@ca/core';

export class RegisterAndSignInUserUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'RegisterAndSignInUserUseCaseError',
      errorCode: 'REGISTER_AND_SIGNIN_USER_ERROR',
      message: 'Failed to execute the register and signIn user use case.',
      cause,
    });
  }
}

export class SignInUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'SignInUseCaseError',
      errorCode: 'SIGNIN_USER_ERROR',
      message: 'Failed to execute the signIn user use case.',
      cause,
    });
  }
}

export class CheckAccessTokenUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'CheckAccessTokenUseCaseError',
      errorCode: 'CHECK_ACCESS_TOKEN_ERROR',
      message: 'Failed to execute the check access token use case.',
      cause,
    });
  }
}

export class RefreshTokenUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'RefreshTokenUseCaseError',
      errorCode: 'REFRESH_TOKEN_ERROR',
      message: 'Failed to execute the refresh token use case.',
      cause,
    });
  }
}

export class SignOutUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'SignOutUseCaseError',
      errorCode: 'SIGN_OUT_ERROR',
      message: 'Failed to execute the sign out use case.',
      cause,
    });
  }
}

export class AuthInvalidCredentialsError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'AuthInvalidCredentialsError',
      errorCode: 'AUTH_INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
      cause,
    });
  }
}

export class AuthInvalidAccessTokenError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'AuthInvalidAccessTokenError',
      errorCode: 'AUTH_INVALID_ACCESS_TOKEN',
      message: 'Invalid access token.',
      cause,
    });
  }
}

export class AuthUserSessionNotFoundError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'AuthUserSessionNotFoundError',
      errorCode: 'AUTH_USER_SESSION_NOT_FOUND',
      message:
        'User session not found. This may be due to forced signOut on all devices or permission changes requiring re-signin.',
      cause,
    });
  }
}

export class AuthAccessTokenVersionMismatchError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'AuthAccessTokenVersionMismatchError',
      errorCode: 'AUTH_ACCESS_TOKEN_VERSION_MISMATCH',
      message:
        'Access token version mismatch. The access token may have been compromised.',
      cause,
    });
  }
}
