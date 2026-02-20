import { mutationOptions, useQueryClient } from "@tanstack/react-query";

export const promptMutationOptions = {
  create: () => {
    return mutationOptions({
      mutationFn: async () => {
        // API 호출 로직 구현
        try {
          // const response = await createPrompt();
          // return response;
        } catch (error) {
          throw new Error("프롬프트 생성 실패");
        }
      },
      onSuccess: () => {
        const queryClient = useQueryClient();
        try {
          queryClient.invalidateQueries();
        } catch (error) {
          console.error("쿼리 무효화 실패:", error);
        }
      },
    });
  },

  update: (promptId: string) => {
    return mutationOptions({
      mutationFn: async () => {
        // API 호출 로직 구현
        try {
          // const response = await updatePrompt(promptId);
          // return response;
        } catch (error) {
          throw new Error("프롬프트 수정 실패");
        }
      },
      onSuccess: () => {
        const queryClient = useQueryClient();
        try {
          queryClient.invalidateQueries();
        } catch (error) {
          console.error("쿼리 무효화 실패:", error);
        }
      },
    });
  },

  delete: (promptId: string) => {
    return mutationOptions({
      mutationFn: async () => {
        // API 호출 로직 구현
        try {
          // const response = await deletePrompt(promptId);
          // return response;
        } catch (error) {
          throw new Error("프롬프트 삭제 실패");
        }
      },
      onSuccess: () => {
        const queryClient = useQueryClient();
        try {
          queryClient.invalidateQueries();
        } catch (error) {
          console.error("쿼리 무효화 실패:", error);
        }
      },
    });
  },
};
