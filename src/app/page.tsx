"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { getQueryClient, trpc } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Background Job started");
      },
    })
  );

  return (
    <div className="p-4 mx-w-7xl mx-auto">
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ text: "Shlok" })}
      >
        Invoke Background Job
      </Button>
    </div>
  );
};

export default Page;
