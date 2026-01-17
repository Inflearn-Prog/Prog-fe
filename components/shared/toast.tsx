import Image from "next/image";
import { toast } from "sonner";

import { STATIC_IMAGES } from "@/lib/static-image";

export const toasts = () => ({
  success: (message: string) =>
    toast.custom(() => <ToastSuccess>{message}</ToastSuccess>, {
      position: "bottom-center",
      duration: 20000,
    }),
});

function ToastSuccess({ children }: { children: string }) {
  const successImage = STATIC_IMAGES.toastSuccess;
  return (
    <div className="bg-gray-950 body-small text-white py-4 px-5 rounded-10 flex items-center gap-x-2">
      <Image {...successImage} />
      {children}
    </div>
  );
}
