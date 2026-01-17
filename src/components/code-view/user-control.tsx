"use client";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

import { useCurrentTheme } from "@/hooks/use-current-theme";

interface Props {
  showName?: boolean;
}

export const UserControl = ({ showName = true }: Props) => {
  const currentTheme = useCurrentTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {mounted ? (
        <UserButton
          showName={showName}
          appearance={{
            elements: {
              userButtonBox: "rounded-md! ",
              userButtonAvatarBox: "rounded-md! size-8!",
              userButtonTrigger: "rounded-md!",
            },
            baseTheme: currentTheme === "dark" ? dark : undefined,
          }}
        />
      ) : null}
    </div>
  );
};
