import { FaChevronRight } from "react-icons/fa6";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

const AuthButton = ({ Icon, label, provider }) => {
  const googleAuth = new GoogleAuthProvider();
  const githubAuth = new GithubAuthProvider();

  const handleClick = async () => {
    switch (provider) {
      case "GoogleAuthProvider":
        await signInWithRedirect(auth, googleAuth)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(`Error: ${err.message}`);
          });
        break;
      case "GithubAuthProvider":
        await signInWithRedirect(auth, githubAuth)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(`Error: ${err.message}`);
          });
        break;
      default:
        await signInWithRedirect(auth, googleAuth)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(`Error: ${err.message}`);
          });
        break;
    }
  };
  return (
    <div
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md hover:text-white"
    >
      <Icon className="text-textPrimary text-xl group-hover:text-white" />

      <p className="text-textPrimary text-lg group-hover:text-white">{label}</p>

      <FaChevronRight className="text-textPrimary text-base group-hover:text-white" />
    </div>
  );
};
export default AuthButton;
