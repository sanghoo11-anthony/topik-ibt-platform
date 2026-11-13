// Modular Authentication Service (Adapter Pattern)
// 현재 구현: Supabase Auth (GoTrue REST API)
// 추후 Firebase / 자체 FastAPI 서버로 이전 시 이 파일의 구현체만 교체하면 UI 코드는 수정할 필요가 없습니다.

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
  user: AuthUser;
}

export interface AuthResult {
  user: AuthUser | null;
  session: AuthSession | null;
  needsEmailConfirmation?: boolean;
  error: string | null;
}

export interface IAuthService {
  getSession(): Promise<AuthSession | null>;
  signUp(email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
}

export const SUPABASE_URL = "https://bnfspjxhzygoqasdfmzn.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_LqVvqRJf8M6CSPArlRhIBw_tOV88ByH";

const STORAGE_KEY = "topik_ibt_auth_session";

function parseSupabaseSession(data: Record<string, unknown>): AuthSession | null {
  const accessToken =
    typeof data.access_token === "string" ? data.access_token : null;
  const refreshToken =
    typeof data.refresh_token === "string" ? data.refresh_token : "";
  const expiresIn =
    typeof data.expires_in === "number" ? data.expires_in : 3600;
  const rawUser = data.user as Record<string, unknown> | undefined;

  if (!accessToken || !rawUser || typeof rawUser.id !== "string") {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    user: {
      id: rawUser.id,
      email: typeof rawUser.email === "string" ? rawUser.email : "",
    },
  };
}

class SupabaseAuthAdapter implements IAuthService {
  private saveSession(session: AuthSession | null) {
    if (typeof window === "undefined") return;
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  private loadSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    const existing = this.loadSession();
    if (!existing) return null;

    // Refresh token if within 60 seconds of expiry
    if (Date.now() > existing.expiresAt - 60_000 && existing.refreshToken) {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_PUBLISHABLE_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: existing.refreshToken }),
          }
        );
        if (res.ok) {
          const data = (await res.json()) as Record<string, unknown>;
          const refreshed = parseSupabaseSession(data);
          if (refreshed) {
            this.saveSession(refreshed);
            return refreshed;
          }
        }
      } catch {
        // Fallback to existing session if offline
      }
    }

    return existing;
  }

  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        const errMsg =
          (data.msg as string) ||
          (data.error_description as string) ||
          (data.message as string) ||
          "회원가입에 실패했습니다.";
        return { user: null, session: null, error: errMsg };
      }

      const session = parseSupabaseSession(data);
      if (session) {
        this.saveSession(session);
        return {
          user: session.user,
          session,
          needsEmailConfirmation: false,
          error: null,
        };
      }

      // Email confirmation required by Supabase project settings
      const rawUser = data.user as Record<string, unknown> | undefined;
      const fallbackUser: AuthUser | null =
        rawUser && typeof rawUser.id === "string"
          ? {
              id: rawUser.id,
              email: typeof rawUser.email === "string" ? rawUser.email : email,
            }
          : { id: "", email };

      return {
        user: fallbackUser,
        session: null,
        needsEmailConfirmation: true,
        error: null,
      };
    } catch {
      return {
        user: null,
        session: null,
        error: "네트워크 연결을 확인해 주세요.",
      };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        const errMsg =
          (data.error_description as string) ||
          (data.msg as string) ||
          "이메일 또는 비밀번호가 올바르지 않습니다.";
        return { user: null, session: null, error: errMsg };
      }

      const session = parseSupabaseSession(data);
      if (!session) {
        return {
          user: null,
          session: null,
          error: "로그인 세션을 생성하지 못했습니다.",
        };
      }

      this.saveSession(session);
      return { user: session.user, session, error: null };
    } catch {
      return {
        user: null,
        session: null,
        error: "네트워크 연결을 확인해 주세요.",
      };
    }
  }

  async signOut(): Promise<void> {
    const existing = this.loadSession();
    this.saveSession(null);
    if (!existing?.accessToken) return;

    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${existing.accessToken}`,
        },
      });
    } catch {
      // Ignore network errors on sign out
    }
  }
}

export const authService: IAuthService = new SupabaseAuthAdapter();
