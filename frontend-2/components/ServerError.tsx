export default function ServerError({
  error,
  field,
}: {
  error: any;
  field: string;
}) {
  return (
    <>
      {error && error[field]
        ? error[field].map((message: string, i: number) => (
            <div className="font-bold text-red-500" key={i}>
              {message}
            </div>
          ))
        : null}
    </>
  );
}
