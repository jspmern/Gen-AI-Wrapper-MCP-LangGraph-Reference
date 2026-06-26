import { Toaster } from "sonner";
import { QueryProvider } from "./QueryProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
};
