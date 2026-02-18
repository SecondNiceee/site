"use client";

import { useState, useEffect } from "react";

export function useSecurity(isAuthenticated: boolean) {
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingUsername, setChangingUsername] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const fetchCurrentUsername = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (response.ok) {
        const data = await response.json();
        if (data.username) {
          setCurrentUsername(data.username);
        }
      }
    } catch (error) {
      console.error("Error fetching current username:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUsername();
    }
  }, [isAuthenticated]);

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError("");

    if (!newUsername || newUsername.trim().length === 0) {
      setUsernameError("Логин не может быть пустым");
      return;
    }

    if (newUsername === currentUsername) {
      setUsernameError("Новый логин должен отличаться от текущего");
      return;
    }

    setChangingUsername(true);
    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.trim(),
          currentPassword: currentPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Логин успешно изменён!");
        setCurrentUsername(newUsername.trim());
        setNewUsername("");
        setCurrentPassword("");
        setUsernameError("");
        fetchCurrentUsername();
      } else {
        setUsernameError(data.message || "Ошибка изменения логина");
      }
    } catch (error) {
      console.error("Error changing username:", error);
      setUsernameError("Ошибка изменения логина");
    } finally {
      setChangingUsername(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPassword,
          currentPassword: currentPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Пароль успешно изменён!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
      } else {
        setPasswordError(data.message || "Ошибка изменения пароля");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Ошибка изменения пароля");
    } finally {
      setChangingPassword(false);
    }
  };

  return {
    currentUsername,
    newUsername,
    setNewUsername,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    changingPassword,
    changingUsername,
    passwordError,
    usernameError,
    handleChangeUsername,
    handleChangePassword,
  };
}
