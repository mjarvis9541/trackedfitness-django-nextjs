import { useMutation } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import postRequest from "../../utils/postRequest";

export default function useCreateDietFromMealDetail() {
  const access = useAccess();
  const url = `diet/create-from-meal/`;

  return useMutation({
    mutationFn: (values) => postRequest({ url, access, values }),
    onSuccess: () => {},
    onError: () => {},
  });
}
