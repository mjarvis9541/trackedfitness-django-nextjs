const API = process.env.NEXT_PUBLIC_API;

export default async function deleteRequest({
  url,
  access,
}: {
  url: string;
  access: string;
}) {
  const res = await fetch(`${API}/${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
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
