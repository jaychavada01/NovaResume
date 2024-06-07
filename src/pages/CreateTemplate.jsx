import React, { useState, useEffect } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";
import { db, storage } from "../config/firebase.config";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref,
  deleteObject,
} from "firebase/storage";
import { initialTags } from "../utils/helpers";
import { serverTimestamp } from "firebase/database";
import useTemplates from "../hooks/useTemplates";
import { doc, setDoc } from "firebase/firestore";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });

  const [selectedTags, setselectedTags] = useState([]);
  const [tempID, setTempID] = useState("Template1");

  const {
    data: templates,
    isError: templatesIsError,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplates();

  useEffect(() => {
    if (templates && templates.length > 0) {
      setTempID(`Template${templates.length + 1}`);
    }
  }, [templates]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));

    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prev) => ({
            ...prev,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error("Error : Authorization Revoked");
          } else {
            toast.error(`Error : ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prev) => ({
              ...prev,
              uri: downloadURL,
            }));
          });

          toast.success("Image Uploaded");

          setTimeout(() => {
            setImageAsset((prev) => ({
              ...prev,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format");
    }
  };

  const deleteImageObject = async () => {
    setTimeout(() => {
      setImageAsset((prev) => ({
        ...prev,
        uri: null,
      }));
    }, 2000);

    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      toast.success("Image Deleted");
    });
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleSelectedTags = (tag) => {
    // check if the tag is selected or not
    if (selectedTags.includes(tag)) {
      // if selected then remove it
      setselectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setselectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name: tempID,
      timeStamp: timeStamp,
    };
    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prev) => ({ ...prev, title: "", imageURL: "" }));
        setImageAsset((prev) => ({ ...prev, uri: null }));
        setselectedTags([]);
        templatesRefetch();
        setTempID(`Template${templates.length + 2}`); // Update the tempID here
        toast.success("Data Pushed to Cloud");
      })
      .catch((err) => {
        console.log(`Error: ${err.message}`);
      });
  };

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-textPrimary">Create a new Template </p>
        </div>

        {/* template id section */}
        <div className="w-full flex items-center  justify-end">
          <p className="text-base text-textLight uppercase font-semibold">
            TempID :
          </p>
          <p className="text-sm text-textDark capitalize font-bold">{tempID}</p>
        </div>

        {/* template tile section */}
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-textPrimary focus:text-textDark focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInput}
        />

        {/* file uploader section */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[420px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <DotLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-textLight">
                          Click to Upload
                        </p>
                      </div>
                    </div>

                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.uri}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />

                    {/* delete action */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={deleteImageObject}
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* Tags */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, index) => (
            <div
              key={index}
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleSelectedTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white rounded-md py-3"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9">2</div>
    </div>
  );
};

export default CreateTemplate;