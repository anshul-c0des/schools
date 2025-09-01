import ShowSchools from "./showSchools/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles

export default function Home() {
  return (
    <>
      <ShowSchools />
      <ToastContainer /> {/* Toast container that renders the notifications */}
    </>
  );
}
