import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

//기본 Button
export function BaseButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button shape="default" className={cn(className)} {...props} />;
}

// 둥근(round)Button
export function RoundButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button shape="round" size="sm" className={cn(className)} {...props} />
  );
}
