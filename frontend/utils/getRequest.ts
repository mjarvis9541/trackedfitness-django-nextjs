const API = process.env.NEXT_PUBLIC_API;

type Props = {
  url: string;
  accessToken: string;
};

export default async function getRequest({ url, accessToken }: Props) {
  const res = await fetch(`${API}/${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
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
