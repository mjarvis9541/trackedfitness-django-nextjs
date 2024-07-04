import ProgressListFooter from "./ProgressListFooter";
import ProgressListHeader from "./ProgressListHeader";
import ProgressListItem from "./ProgressListItem";

const ProgressListContainer = ({
  username,
  isLoading,
  error,
  data,
  isCheck,
  isCheckAll,
  handleCheck,
  handleCheckAll,
  monthRange,
}) => {
  return (
    <>
      <ProgressListHeader
        isCheckAll={isCheckAll}
        handleCheckAll={handleCheckAll}
      />
      <ProgressList
        username={username}
        isCheck={isCheck}
        handleCheck={handleCheck}
        isLoading={isLoading}
        error={error}
        data={data}
        monthRange={monthRange}
      />
      <ProgressListFooter isCheck={isCheck} />
    </>
  );
};

const ProgressList = ({
  username,
  isLoading,
  error,
  data,
  isCheck,
  handleCheck,
  monthRange,
}) => {
  if (isLoading)
    return <div className="col-span-9 bg-gray-100 p-2">Loading...</div>;
  if (error) return <div className="col-span-9 bg-gray-100 p-2">Error</div>;

  const merger = monthRange.map((dr) => {
    const obj = data.find((obj) => obj.date === dr.date);
    if (obj) return { ...dr, ...obj };
    return dr;
  });

  return (
    <>
      {merger.map((progress) => (
        <ProgressListItem
          key={progress.date}
          username={username}
          data={progress}
          isCheck={isCheck}
          handleCheck={handleCheck}
        />
      ))}
    </>
  );
};

export default ProgressListContainer;
