import { Suspense } from "react";
import Header from "../components/Header";
import MainSpinner from "../components/MainSpinner";
import { Route, Routes } from "react-router-dom";
import HomeContainer from "../components/HomeContainer";
import CreateTemplate from "./CreateTemplate";
import Profile from "./Profile";
import CreateResume from "./CreateResume";
import TemplateDesignPinDetails from "./TemplateDesignPinDetails";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* header */}
      <Header />

      {/* custom routes */}
      <main className="w-full">
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplate />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route path="/resume/*" element={<CreateResume />} />
            <Route
              path="/resumeDetail/:templateID"
              element={<TemplateDesignPinDetails />}
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};
export default Home;
