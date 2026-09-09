"use client";

import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  className = "",
  ...rest
}) {
  const cls = [
    styles.btn,
    styles[variant],
    size === "sm" ? styles.sm : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} disabled={disabled} {...rest}>
      {icon}
      {children}
    </button>
  );
}
