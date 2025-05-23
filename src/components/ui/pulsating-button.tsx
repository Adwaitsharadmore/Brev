import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}
  

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = "#0096ff",
      duration = "1.5s",
      ...props
    },
    ref,
  ) => {
    const router = useRouter();

    const handleStartBreving = () => {
      router.push("/responsePage");
    };

    return (
      <button
        onClick={handleStartBreving}
        ref={ref}
        className={cn(
          "relative flex cursor-pointer items-center text-xl justify-center rounded-full bg-slate-900 px-4 py-2 text-center text-slate-50 dark:bg-slate-50 dark:text-slate-900",
          className,
        )}
        style={
          {
            "--pulse-color": pulseColor,
            "--duration": duration,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <div className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-inherit" />
      </button>
    );
  },
);

PulsatingButton.displayName = "PulsatingButton";
