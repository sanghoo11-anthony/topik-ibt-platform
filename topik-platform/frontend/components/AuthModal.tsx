"use client";

import React, { useState } from "react";
import { LogIn, LogOut, Mail, Lock, UserCheck, X, Sparkles } from "lucide-react";
import { authService, AuthSession, AuthUser } from "@/services/authService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onAuthSuccess: (session: AuthSession) => void;
  onSignOut: () => void;
  selectedLanguage: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onSignOut,
  selectedLanguage,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isKo = selectedLanguage === "ko";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const res = await authService.signIn(email.trim(), password);
        if (res.error) {
          setErrorMsg(res.error);
        } else if (res.session) {
          onAuthSuccess(res.session);
          onClose();
        }
      } else {
        const res = await authService.signUp(email.trim(), password);
        if (res.error) {
          setErrorMsg(res.error);
        } else if (res.needsEmailConfirmation) {
          setInfoMsg(
            isKo
              ? "가입 확인 메일을 발송했습니다! 이메일함에서 인증 링크를 클릭한 뒤 로그인해 주세요."
              : "Confirmation email sent! Please verify your email and sign in."
          );
        } else if (res.session) {
          onAuthSuccess(res.session);
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {currentUser ? (
          <div className="space-y-5 pt-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <UserCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isKo ? "로그인된 계정" : "Signed-in Account"}
              </h3>
              <p className="mt-1 text-sm font-semibold text-blue-700">
                {currentUser.email}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {isKo
                  ? "목표 급수, 모국어 설정, 나만의 단어장, 모의고사 성적이 클라우드에 자동 동기화됩니다."
                  : "Your target level, saved words, and exam records are synced to the cloud."}
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                await authService.signOut();
                onSignOut();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>{isKo ? "로그아웃" : "Sign Out"}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                <Sparkles className="h-3 w-3" />
                Cloud Sync Account
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                {mode === "signin"
                  ? isKo
                    ? "로그인"
                    : "Sign In"
                  : isKo
                    ? "회원가입"
                    : "Create Account"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {isKo
                  ? "계정을 연결하면 내 단어장과 모의고사 성적 기록이 안전하게 저장됩니다."
                  : "Save your vocabulary notebook and mock exam scores across devices."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                  setInfoMsg(null);
                }}
                className={`rounded-lg py-2 transition ${
                  mode === "signin"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {isKo ? "로그인" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                  setInfoMsg(null);
                }}
                className={`rounded-lg py-2 transition ${
                  mode === "signup"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {isKo ? "회원가입" : "Sign Up"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {isKo ? "이메일" : "Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {isKo ? "비밀번호 (6자 이상)" : "Password (6+ chars)"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
                  {errorMsg}
                </div>
              )}

              {infoMsg && (
                <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                  {infoMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {loading
                    ? isKo
                      ? "처리 중..."
                      : "Processing..."
                    : mode === "signin"
                      ? isKo
                        ? "이메일로 로그인"
                        : "Sign In with Email"
                      : isKo
                        ? "회원가입 완료"
                        : "Create Account"}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
