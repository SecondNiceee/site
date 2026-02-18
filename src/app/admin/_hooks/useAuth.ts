"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const isAuth = sessionStorage.getItem("admin_authenticated");
        if (isAuth === "true") {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("admin_authenticated");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Введите логин и пароль");
      return;
    }
    if (isBlocked) {
      return;
    }
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
        setError("");
        setUsername("");
        setPassword("");
        setIsBlocked(false);
        setBlockedUntil(null);
        setRemainingAttempts(null);
      } else {
        setError(data.message || "Неверный логин или пароль");
        if (data.blocked) {
          setIsBlocked(true);
          setBlockedUntil(data.blockedUntil);
          setRemainingAttempts(0);
        } else if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      setError("Ошибка входа");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  return {
    isAuthenticated,
    isCheckingAuth,
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    isBlocked,
    blockedUntil,
    remainingAttempts,
    handleLogin,
    handleLogout,
  };
}
