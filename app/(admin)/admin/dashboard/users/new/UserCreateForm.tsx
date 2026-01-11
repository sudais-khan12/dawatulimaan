"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";

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
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: CreateUserValues) => {
    startTransition(async () => {
      try {
        await createUserAction(values);
        toast.success("Admin email added to allowlist.");
        form.reset({ email: "" });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create user.",
        );
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

          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard/events"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to events
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add admin email"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserCreateForm;
