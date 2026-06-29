type IconName = "phone" | "bag" | "gift" | "calendar" | "qr" | "plug" | "chart" | "users" | "check" | "arrow" | "clock" | "shield" | "wallet";

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    phone: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4M11 19h2"/></>,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    gift: <><path d="M3 10h18v4H3zM5 14h14v8H5zM12 10v12"/><path d="M12 10H8.5a2.5 2.5 0 1 1 2.2-3.7L12 10Zm0 0h3.5a2.5 2.5 0 1 0-2.2-3.7L12 10Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 15h3"/></>,
    qr: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM15 14h2v2h-2zM19 14h2v4h-2zM14 19h3v2h-3zM19 20h2v1"/></>,
    plug: <><path d="M9 8V3M15 8V3M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v5"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    wallet: <><path d="M3 6h16a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2V6Z"/><path d="M3 7V5a2 2 0 0 1 2-2h12M15 12h6v4h-6a2 2 0 0 1 0-4Z"/></>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...common}>{paths[name]}</svg>;
}
