const API = process.env.NEXT_PUBLIC_API;

export default async function postRequest({
  url,
  access,
  values,
}: {
  url: string;
  access: string;
  values: any;
}) {
  const res = await fetch(`${API}/${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
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
