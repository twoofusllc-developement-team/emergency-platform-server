import { store } from "../redux/persist/persist";
import { setRateLimit, resetRateLimit } from "../redux/slices/ratelimiterSlice";

class RateLimiter {
  constructor(key, config) {
    this.key = key;
    this.config = config;
  }

  getState() {
    const state = store.getState().rateLimit[this.key];
    if (!state) return null;

    // Clean up expired window
    const now = Date.now();
    if (now - state.windowStart >= this.config.windowMs) {
      store.dispatch(resetRateLimit(this.key));
      return null;
    }

    return state;
  }

  canAttempt() {
    const state = this.getState();
    if (!state)
      return { allowed: true, remainingAttempts: this.config.maxAttempts };

    const now = Date.now();
    const timeElapsed = now - state.windowStart;

    if (timeElapsed >= this.config.windowMs) {
      store.dispatch(resetRateLimit(this.key));
      return { allowed: true, remainingAttempts: this.config.maxAttempts };
    }

    if (state.attempts >= this.config.maxAttempts) {
      return {
        allowed: false,
        remainingMs: this.config.windowMs - timeElapsed,
        remainingAttempts: 0,
      };
    }

    return {
      allowed: true,
      remainingMs: this.config.windowMs - timeElapsed,
      remainingAttempts: this.config.maxAttempts - state.attempts,
    };
  }

  increment() {
    const state = this.getState();
    const now = Date.now();

    if (!state) {
      store.dispatch(
        setRateLimit({
          key: this.key,
          attempts: 1,
          windowStart: now,
        })
      );
      return;
    }

    store.dispatch(
      setRateLimit({
        key: this.key,
        attempts: state.attempts + 1,
        windowStart: state.windowStart,
      })
    );
  }

  reset() {
    store.dispatch(resetRateLimit(this.key));
  }
}

// Logical rate limits:
// Sign in: 5 attempts per 15 minutes
// Sign up: 3 attempts per 30 minutes
const SIGNIN_RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
};

const SIGNUP_RATE_LIMIT_CONFIG = {
  maxAttempts: 3,
  windowMs: 30 * 60 * 1000,
};

export const signinLimiter = new RateLimiter(
  "signIn",
  SIGNIN_RATE_LIMIT_CONFIG
);
export const signupLimiter = new RateLimiter(
  "signUp",
  SIGNUP_RATE_LIMIT_CONFIG
);

export { RateLimiter }; 