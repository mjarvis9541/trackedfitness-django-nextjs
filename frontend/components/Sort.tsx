const Sort = ({ ordering, setOrdering, setPage, options }) => {
  return (
    <select
      className="w-full rounded border bg-white py-2 px-3 focus:outline-none focus:ring focus:ring-blue-400"
      value={ordering}
      onChange={(e) => {
        setOrdering(e.target.value);
        setPage(1);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.display}
        </option>
      ))}
    </select>
  );
};

export default Sort;
