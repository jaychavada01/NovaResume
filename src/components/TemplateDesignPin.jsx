import { AnimatePresence, motion } from "framer-motion";
import {
  FadeInOutWithOpacity,
  scaleInOut,
  slideLeftIn,
} from "../animation/Animate";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import { useState } from "react";
import useUser from "../hooks/useUser";
import { saveToCollections, saveToFavourites } from "../api";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, index }) => {
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: temp_refetch } = useTemplates();

  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Error saving to Favourites:", error);
    }
  };

  const handleRouteNavigation = () => {
    navigate(`/resumeDetail/${data?._id}`, { replace: true });
  };

  return (
    <motion.div key={data?._id} {...scaleInOut(index)}>
      <div
        className="w-full h-[500px] 2xl:h-[450px] rounded-md bg-gray-200 overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={data?.imageURL} className="w-full h-full object-cover" />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              {...FadeInOutWithOpacity}
              onClick={handleRouteNavigation}
              className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
            >
              <div className="flex flex-col items-end justify-start w-full gap-8">
                <InnerBoxCard
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Added to Collection"
                      : "Add to Collection"
                  }
                  Icon={
                    user?.collections?.includes(data?._id)
                      ? BiSolidFolderPlus
                      : BiFolderPlus
                  }
                  onHandle={addToCollection}
                />
                <InnerBoxCard
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Added to Favourite"
                      : "Add to Favourite"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={addToFav}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
      onClick={onHandle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="text-textPrimary text-base" />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            {...slideLeftIn}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45"
          >
            <p className="text-sm text-textPrimary whitespace-nowrap">
              {label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default TemplateDesignPin;
