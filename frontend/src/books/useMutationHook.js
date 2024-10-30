import { useMutation } from "@tanstack/react-query";

export const useUserMutation = (fnCallback) => {
  // Gọi useMutation bên trong custom hook
  const mutation = useMutation({
    mutationFn: fnCallback,
  });

  return mutation;
};
