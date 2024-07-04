import { API } from "./constants";

type Props = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token: string | undefined;
  url: string;
  values: any;
};

export default async function authClientFetch({
  method,
  token,
  url,
  values,
}: Props) {
  const res = await fetch(`${API}/${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw {
      message: `Request failed with status code ${res.status}`,
      response: {
        data: res.status < 404 && (await res.json()),
        status: res.status,
        statusText: res.statusText,
      },
    };
  }
  return res.json();
}
