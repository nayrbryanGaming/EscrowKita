import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;  
  as?: "button" | "a";
} & React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
  children,
  variant = "primary",
  className = "",
  as = "button",
  ...props
}: ButtonProps) {


  // Use new utility classes for world-class style
  let base = "fade-in ";
  let style = "";
  switch (variant) {
    case "primary":
      style = "btn-main";
      break;
    case "outline":
      style = "btn-outline-main";
      break;
    case "secondary":
      style = "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-7 py-3 rounded-full font-bold";
      break;
    default:
      style = "bg-transparent text-blue-700 hover:bg-blue-50 px-7 py-3 rounded-full font-bold";
  }

  if (as === "a") {
    // @ts-ignore
    return (
      <a className={`${base}${style} ${className}`.trim()} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={`${base}${style} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
