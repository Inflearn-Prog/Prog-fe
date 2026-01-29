import Image from "next/image";
import { toast } from "sonner";

import { STATIC_IMAGES } from "@/lib/static-image";

export const toasts = {
  success: (message: string) =>
    toast(() => <ToastSuccess>{message}</ToastSuccess>, {
      position: "bottom-center",
      duration: 5 * 1000,
      className: "bg-gray-950! w-full py-4 px-5 inline-flex justify-center",
    }),
};

function ToastSuccess({ children }: { children: string }) {
  const successImage = STATIC_IMAGES.toastSuccess;
  return (
    <div className="w-full body-small text-center text-white rounded-10 flex items-center gap-x-2">
      <Image {...successImage} />
      {children}
    </div>
  );
}
