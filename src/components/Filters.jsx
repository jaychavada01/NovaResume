import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { slideUpDownwithScale } from "../animation/Animate";
import { FiltersData } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";

const Filters = () => {
  const [isClearHovered, setisClearHovered] = useState(false);

  const { data: filterData, isLoading, isError } = useFilters();

  const queryClient = useQueryClient();

  const handleFilterValue = (value) => {
    // const prevState = queryClient.getQueryData("globalFilter");
    // const updatedState = { ...prevState, searchTerm: value };
    // queryClient.setQueryData("globalFilter", updatedState);

    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: value,
    });
  };

    const clearFilter = () => {
      queryClient.setQueryData("globalFilter", {
        ...queryClient.getQueryData("globalFilter"),
        searchTerm: "",
      });
    };

  return (
    <div className="w-full flex items-center justify-start py-4">
      <div
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={() => setisClearHovered(true)}
        onMouseLeave={() => setisClearHovered(false)}
        onClick={clearFilter}
      >
        <MdLayersClear className="text-xl" />

        <AnimatePresence>
          {isClearHovered && (
            <motion.div
              {...slideUpDownwithScale}
              className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1"
            >
              <p className="whitespace-nowrap text-xs">Clear All</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
              onClick={() => handleFilterValue(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md ${
                filterData &&
                filterData.searchTerm === item.value &&
                "bg-gray-300 shadow-md"
              }`}
            >
              <p className="text-sm text-textPrimary group-hover:text-textDark whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Filters;
