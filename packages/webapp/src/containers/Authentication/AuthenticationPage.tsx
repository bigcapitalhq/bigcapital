import { EnsureAuthNotAuthenticated } from "@/components/Guards/EnsureAuthNotAuthenticated";
import { Authentication } from "./Authentication";

export default function AuthenticationPage() {
  return (
    <EnsureAuthNotAuthenticated>
      <Authentication />
    </EnsureAuthNotAuthenticated>
  );
}
