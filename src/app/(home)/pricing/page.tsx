"use client";
import Image from "next/image";
import { dark } from "@clerk/themes";
import { PricingTable } from "@clerk/nextjs";

import { useCurrentTheme } from "@/hooks/use-current-theme";

export default function PricingPage() {
  const currentTheme = useCurrentTheme();
  const isBillingEnabled =
    process.env.NEXT_PUBLIC_CLERK_BILLING_ENABLED === "true";

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
      <div className="flex flex-col items-center">
        <Image src="/logo.svg" alt="Vibe" width={50} height={50} className="hidden md:block" />
      </div>
      <h1 className="text-xl md:text-3xl text-center font-bold">Pricing</h1>
      <p className="text-muted-foreground text-center text-sm md:text-base">Choose the plan that&apos;s right for you</p>
      {isBillingEnabled ? (
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
            elements: {
              pricingTableCard: "border! shadow-none! rounded-lg!",
            },
          }}
        />
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          Billing is disabled. Enable it in the Clerk dashboard to view pricing.
        </div>
      )}
      </section>
    </div>
  )
}
