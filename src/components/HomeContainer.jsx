import React from "react";
import useTemplates from "../hooks/useTemplates";
import Filters from "./Filters";
import MainSpinner from "./MainSpinner";
import { AnimatePresence } from "framer-motion";
import TemplateDesignPin from "./TemplateDesignPin";

const HomeContainer = () => {
  const {
    data: templates,
    isError: temp_isError,
    isLoading: temp_isLoading,
    refetch: temp_refetch,
  } = useTemplates();

  if (temp_isLoading) {
    return <MainSpinner />;
  }
  return (
    <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      {/* Filter Section */}
      <Filters />

      {/* Render those templates */}
      {temp_isError ? (
        <>
          <p className="text-lg text-textDark">
            Something went wrong..Please try again later
          </p>
        </>
      ) : (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <RenderTemplate templates={templates} />
          </div>
        </>
      )}
    </div>
  );
};

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesignPin
                  key={template?._id}
                  data={template}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>No Data Found</p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default HomeContainer;
