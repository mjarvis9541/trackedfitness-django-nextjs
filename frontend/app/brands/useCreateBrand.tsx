"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import postRequest from "../../utils/postRequest";

export default function useCreateBrand() {
  const queryClient = useQueryClient();
  const access = useAccess();
  const url = `brands/`;

  return useMutation({
    mutationFn: (values) => postRequest({ url, access, values }),
    onSuccess: () => {},
    onError: () => {},
  });
}
