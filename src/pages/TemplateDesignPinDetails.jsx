import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  getTemplateDetails,
  saveToCollections,
  saveToFavourites,
} from "../api";
import MainSpinner from "../components/MainSpinner";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import React from "react";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import TemplateDesignPin from "../components/TemplateDesignPin";

const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();
  const {
    data: templates,
    refetch: temp_refetch,
    isLoading: temp_isLoading,
  } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    try {
      await saveToCollections(user, data);
      userRefetch();
    } catch (error) {
      console.error("Error saving to collections:", error);
    }
  };

  const addToFav = async (e) => {
    e.stopPropagation();
    try {
      await saveToFavourites(user, data);
      temp_refetch();
      refetch();
    } catch (error) {
      console.error("Error saving to Favourites:", error);
    }
  };

  if (isLoading) {
    return <MainSpinner />;
  }

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-textPrimary font-semibold">
          Error while fetching data...Please try again later
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col px-4 py-12">
      {/* bread crump */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-textPrimary"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* main section layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left section */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          <img
            src={data?.imageURL}
            className="w-full h-auto object-contain rounded-md"
          />

          {/* title and other options */}
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-textPrimary font-semibold">
                {data?.title}
              </p>

              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base text-textPrimary font-semibold">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>

            {user && (
              <div className="flex items-center justify-center gap-3">
                {/* Add to collection section */}
                {user?.collections?.includes(data?._id) ? (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidFolderPlus className="text-base text-textPrimary" />
                      <p className="text-sm text-textPrimary whitespace-nowrap">
                        Remove From Collections
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiFolderPlus className="text-base text-textPrimary" />
                      <p className="text-sm text-textPrimary whitespace-nowrap">
                        Add To Collections
                      </p>
                    </div>
                  </React.Fragment>
                )}

                {/* Add to Favourite section */}
                {data?.favourites?.includes(user?.uid) ? (
                  <React.Fragment>
                    <div
                      onClick={addToFav}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidHeart className="text-base text-textPrimary" />
                      <p className="text-sm text-textPrimary whitespace-nowrap">
                        Remove From Favourites
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToFav}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiHeart className="text-base text-textPrimary" />
                      <p className="text-sm text-textPrimary whitespace-nowrap">
                        Add To Favourites
                      </p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6">
          <div
            className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative"
            style={{
              background:
                "url(https://cdn.pixabay.com/photo/2021/07/24/22/59/document-6490538_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-4 py-2 rounded-md border-2 border-gray-50 text-white"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* edit template section */}
          {/* localhost:5173/resume/resume_name/resume_id */}
          {user && (
            <Link
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-yellow-500 cursor-pointer tracking-widest"
              to={`/resume/${data?.name}?templateID=${templateID}`}
            >
              <p className="text-black font-semibold text-lg">
                Edit this Template
              </p>
            </Link>
          )}

          {/* tags for editing */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2">
            {data?.tags?.map((tag, index) => (
              <p
                key={index}
                className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* similat templates */}
      {templates?.filter((temp) => temp._id !== data?._id).length > 0 && (
        <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
          <p className="text-lg font-semibold text-textDark">
            You might also like..
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <AnimatePresence>
              {templates
                ?.filter((temp) => temp._id !== data?._id)
                .map((template, index) => (
                  <TemplateDesignPin
                    key={template?._id}
                    data={template}
                    index={index}
                  />
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
export default TemplateDesignPinDetails;