import {toast} from "sonner"
import { useAppStore } from "@/store/store";
import axios from "axios";
import { HOST, DELETE_PROFILE_PICTURE_ROUTE } from "@/utils/constants";



const ConfirmDelete = ({isModalOpen, setIsModalOpen, setSelectedImage}) => {

    const { setUser } = useAppStore();


    const handleCancelDelete = () => {
        setIsModalOpen(false)
    }

    // This function delete user picture
    const handleDeleteProfilePicture = async () => {
        setIsModalOpen(false) //Close the modal
        try {
            const response = await axios.delete(`${HOST}/${DELETE_PROFILE_PICTURE_ROUTE}`, {
                withCredentials: true, // Important: Sends cookies with the request
              })
              
            if (response.data.success) {
                setSelectedImage(null)
                setUser(response.data.user)  //Set user to the new user received so state update properly
                toast.success("Profile picture deleted")
            } else {
                toast.error("Error deleting profile picture, try again!")
            }
        } catch (error) {
            console.log(error);
            
        }
    }


    return (
        <div className={`fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center z-50 duration-300 transition-transform ${isModalOpen ? "scale-100" : "scale-0"}`}>
            <div className={`bg-slate-800 p-4 rounded-tr-xl rounded-bl-xl w-[80vw] max-w-sm sm:border border-slate-700 flex flex-col gap-10 sm:gap-5 shadow-2xl ` }>
                <h3 className="text-base mb-4 text-center text-gray-200">Confirm to delete profile picture</h3>
                <div className="flex gap-12 items-center justify-center">
                    <button className="p-2 px-5 bg-red-700 rounded-tr-md rounded-bl-md"
                    onClick={handleDeleteProfilePicture}
                    >
                        Delete
                    </button>
                    <button className="p-2 px-5 bg-green-700 rounded-tr-md rounded-bl-md"
                    onClick={handleCancelDelete}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete