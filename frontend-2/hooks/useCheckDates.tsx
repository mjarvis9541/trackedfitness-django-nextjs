"use client";

import { useEffect, useState } from "react";

export default function useCheckDates({ data }) {
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isChecked, setIsChecked] = useState([]);

  const handleCheck = (e) => {
    const { value, checked } = e.target;
    setIsChecked((prev) => [...prev, value]);
    if (!checked) {
      setIsChecked((prev) => prev.filter((date) => date !== value));
    }
  };

  const handleCheckAll = (value) => {
    setIsAllChecked(value);
    setIsChecked(data.map((obj) => obj.date));
    if (isAllChecked) {
      setIsChecked([]);
    }
  };

  useEffect(() => {
    const allChecked = data.every((obj) => isChecked.includes(obj.date));
    if (allChecked) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [data, isChecked]);

  return { isChecked, isAllChecked, handleCheck, handleCheckAll };
}
