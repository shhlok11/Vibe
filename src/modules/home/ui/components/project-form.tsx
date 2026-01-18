"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "@/modules/constants";
import { useClerk } from "@clerk/nextjs";



const formSchema = z.object({
  value: z.string()
    .min(1, { error: "Value is required" })
    .max(10000, { error: "Value is too long" }),
})
export const ProjectForm = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);


  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const clerk = useClerk();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const handleMutationError = (error: unknown) => {
    const errorData =
      (error as { data?: { code?: string | null; httpStatus?: number | null } } | null)?.data ??
      (error as { shape?: { data?: { code?: string | null; httpStatus?: number | null } } } | null)
        ?.shape?.data;
    const errorCode = errorData?.code ?? undefined;
    const httpStatus = errorData?.httpStatus ?? undefined;
    const errorMessage = (error as { message?: string } | null)?.message ?? "";
    if (errorCode === "UNAUTHORIZED") {
      clerk.openSignIn();
      return;
    }
    if (
      errorCode === "TOO_MANY_REQUESTS" ||
      httpStatus === 429 ||
      errorMessage.toLowerCase().includes("out of credits")
    ) {
      router.push("/pricing");
    }
  };

  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries(
        trpc.projects.getMany.queryOptions()
      );
      router.push(`/projects/${data.id}`);
      setTimeout(() => {
        if (window.location.pathname === "/") {
          window.location.href = `/projects/${data.id}`;
        }
      }, 500);
      queryClient.invalidateQueries(
        trpc.usage.getStatus.queryOptions()
      );
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
      handleMutationError(error);
    }
  }));

  const { isPending } = createProject;
  const isButtonDisabled = isPending || !form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      await createProject.mutateAsync({
        value: values.value,
      });
    } catch (error) {
      handleMutationError(error);
    }

  }

  const onSelect = (content: string) => {
    form.setValue("value", content, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }


  return (
    <Form {...form}>
      <section className="space-y-6">
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && "shadow-xs"
          )}
        >
          <FormField 
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                placeholder="What would you like to build?"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
              &nbsp;to submit
            </div>
            <Button
              className={
                cn(
                  "size-8 rounded-full",
                  isButtonDisabled && "bg-muted-foreground border"
                )
              }
              disabled={isButtonDisabled}
              type="submit"
              onClick={(e) => form.handleSubmit(onSubmit)(e)}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin"/>
              ) : (
                <ArrowUpIcon />
              )}
            </Button>
          </div>
        </form>
        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
            key={template.title}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-sidebar"
            onClick={() => onSelect(template.prompt)}
            >
              {template.emoji}
              {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  )
}
