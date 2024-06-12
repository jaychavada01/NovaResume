import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import TemplateDesignPin from "../components/TemplateDesignPin";
import useTemplates from "../hooks/useTemplates";
import { Link, useNavigate } from "react-router-dom";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";
import MainSpinner from "../components/MainSpinner";
import { FaHouse } from "react-icons/fa6";

const Profile = () => {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState("collections");
  const navigate = useNavigate();

  const {
    data: templates,
    isError: temp_isError,
    isLoading: temp_isLoading,
  } = useTemplates();

  const { data: savedResumes } = useQuery(["savedResumes"], () =>
    getSavedResumes(user?.uid)
  );

  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
    }
  }, [user, navigate]);

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full flex items-center gap-2 px-4">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p
          className="text-txtPrimary"
        >
          / Profile
        </p>
      </div>
      <div className="w-full h-72 bg-blue-50">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cover"
        />

        <div className="flex items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
              referrerPolicy="no-referrer"
              loading="lazy"
              alt="Profile"
            />
          ) : (
            <img
              src="https://img.freepik.com/premium-vector/adorable-cyberpunk-dj-vector_868778-486.jpg"
              className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
              referrerPolicy="no-referrer"
              loading="lazy"
              alt="Default Profile"
            />
          )}

          <p className="text-2xl text-textDark">{user?.displayName}</p>
        </div>

        {/* tabs */}
        <div className="flex origin-center justify-center mt-12">
          {/* collections tab */}
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("collections")}
          >
            <p
              className={`text-base text-textPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              Collections
            </p>
          </div>

          {/* resume tab */}
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("resumes")}
          >
            <p
              className={`text-base text-textPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "resumes" && "bg-white shadow-md text-blue-600"
              }`}
            >
              My Resume
            </p>
          </div>
        </div>

        {/* tab contents */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections && user.collections.length > 0 ? (
                  <RenderTemplate
                    templates={templates?.filter((temp) =>
                      user.collections.includes(temp._id)
                    )}
                  />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt="No data"
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}

            {activeTab === "resumes" && (
              <React.Fragment>
                {savedResumes && savedResumes.length > 0 ? (
                  <RenderTemplate templates={savedResumes} />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt="No data"
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates.map((template, index) => (
              <TemplateDesignPin
                key={template._id}
                data={template}
                index={index}
              />
            ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Profile;
