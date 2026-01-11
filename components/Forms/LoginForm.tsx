"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestMagicLink } from "@/app/(admin)/admin/login/actions/request-magic-link";

type ActionState = {
  status: "idle" | "sent" | "error";
  message: string;
};

const initialState: ActionState = {
  status: "idle",
  message: "",
};

const LoginForm = () => {
  const params = useSearchParams();
  const [state, formAction, isPending] = useActionState(
    async (_: ActionState, formData: FormData) => {
      const redirect = params.get("redirect");
      if (redirect) {
        formData.set("next", redirect);
      }
      return requestMagicLink(_, formData);
    },
    initialState
  );

  const disabled = isPending || state.status === "sent";

  useEffect(() => {
    if (state.status === "sent" && state.message) {
      toast.success(state.message);
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <form className="space-y-4" action={formAction}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={disabled}
          />
        </div>

        <input type="hidden" name="next" value={params.get("redirect") ?? ""} />

        <Button type="submit" className="w-full" disabled={disabled}>
          {state.status === "sent"
            ? "Magic link sent"
            : isPending
            ? "Sending..."
            : "Send magic link"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
