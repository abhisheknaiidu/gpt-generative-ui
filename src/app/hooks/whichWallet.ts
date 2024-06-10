export default () =>
  typeof window !== "undefined"
    ? (window as any).solana || (window as any).solflare
    : null;
