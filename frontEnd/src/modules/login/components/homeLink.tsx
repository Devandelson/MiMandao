import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

export default function HomeLink() {
  return (
    <Link
      to="/"
      aria-label="Go to Home"
      className="group fixed bottom-5 left-5 z-50 flex items-center justify-center rounded-full bg-orange-500 p-3.5 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 hover:pr-5 hover:shadow-xl hover:shadow-orange-500/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      <FontAwesomeIcon 
        icon={faHome} 
        className="text-lg transition-transform duration-300 group-hover:scale-110" 
      />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:ml-2.5 group-hover:max-w-xs group-hover:opacity-100">
        Home
      </span>
    </Link>
  );
}