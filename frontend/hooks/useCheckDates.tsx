"use client";
import { useEffect, useState } from "react";

const useCheckDates = ({ data }) => {
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const allChecked = data?.every((obj) => isCheck.includes(obj.date));
  const isData = data?.length;

  useEffect(() => {
    if (!allChecked) setIsCheckAll(false);
    if (allChecked && isData) return setIsCheckAll(true);
  }, [isCheck]);

  const handleCheckAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.map((data) => data.date));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const resetCheck = () => {
    setIsCheckAll(false);
    setIsCheck([]);
  };

  return { isCheck, isCheckAll, handleCheck, handleCheckAll, resetCheck };
};

export default useCheckDates;
