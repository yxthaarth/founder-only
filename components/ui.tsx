"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export function Panel({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("surface rounded-2xl", className)}>{children}</div>;
}

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-white text-zinc-900 hover:bg-zinc-200",
    secondary: "bg-surface text-white border border-line hover:bg-zinc-800",
    ghost: "bg-transparent text-zinc-300 border border-line hover:bg-zinc-900",
    danger: "bg-white text-zinc-900 hover:bg-zinc-200"
  };

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-line bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-line bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500",
        props.className
      )}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{children}</label>;
}

export function Stat({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="font-mono text-sm text-zinc-100">{value}</p>
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="surface w-full max-w-2xl rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <button onClick={onClose} className="text-sm text-zinc-500 transition hover:text-white">
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
