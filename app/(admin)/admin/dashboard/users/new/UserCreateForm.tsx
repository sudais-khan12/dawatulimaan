"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createUserSchema,
  type CreateUserValues,
} from "@/app/(admin)/admin/dashboard/users/new/schema";
import { createUserAction } from "@/app/(admin)/admin/dashboard/users/actions/create-user";

const UserCreateForm = () => {
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "admin",
    },
  });

  const onSubmit = (values: CreateUserValues) => {
    setStatus({ type: "idle" });
    startTransition(async () => {
      try {
        await createUserAction(values);
        setStatus({ type: "success", message: "User created successfully." });
        form.reset({ email: "", password: "", role: "admin" });
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to create user.",
        });
      }
    });
  };

  const isSubmitting = isPending || form.formState.isSubmitting;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard/events"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to events
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create user"}
            </Button>
          </div>
        </form>
      </Form>

      {status.type === "success" && status.message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          {status.message}
        </div>
      )}
      {status.type === "error" && status.message && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {status.message}
        </div>
      )}
    </div>
  );
};

export default UserCreateForm;
