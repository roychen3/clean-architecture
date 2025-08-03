import { Store } from '@tanstack/store';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
}

export class AuthStore extends Store<AuthState> {
  constructor() {
    const accessToken = window.localStorage.getItem('accessToken');
    super({
      accessToken,
      isAuthenticated: !!accessToken,
    });
  }

  setAccessToken(value: string | null) {
    if (value) {
      window.localStorage.setItem('accessToken', value);
    } else {
      window.localStorage.removeItem('accessToken');
    }
    this.setState((prevState) => ({
      ...prevState,
      accessToken: value,
      isAuthenticated: !!value,
    }));
  }
}

export const authStore = new AuthStore();
