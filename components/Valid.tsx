import { ReactNode } from "react";

export const Valid = ({
  children,
  isValid,
}: {
  children: ReactNode;
  isValid: boolean;
}) => {
  if (!isValid) return null;
  return <>{children}</>;
};
