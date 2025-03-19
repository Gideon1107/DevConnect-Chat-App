import { FaCircleArrowUp } from "react-icons/fa6";
import { useState } from "react";

const BackToTop = () => {

    const [setshowBackToTop, setSetshowBackToTop] = useState(false);

    window.onscroll = () => {
        if (window.scrollY > 50) {
            setSetshowBackToTop(true);
        } else {
            setSetshowBackToTop(false);
        }
    }

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    return (
        <div className={`fixed font-extralight bottom-20 right-4 p-2 rounded-full cursor-pointer ${!setshowBackToTop && "hidden"} `}  onClick={handleScrollToTop}>
            <FaCircleArrowUp size={35} className="text-white backdrop-blur-sm transition-all duration-200 ease-in-out opacity-50 hover:opacity-100" />
        </div>
    )

}

export default BackToTop