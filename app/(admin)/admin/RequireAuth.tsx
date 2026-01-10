"use client";

type Props = {
  children: React.ReactNode;
};

// Middleware already guards /admin routes; this wrapper just renders children.
const RequireAuth = ({ children }: Props) => {
  return <>{children}</>;
};

export default RequireAuth;
