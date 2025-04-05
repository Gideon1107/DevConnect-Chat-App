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
            <div className={`bg-slate-800 p-4 rounded-tr-xl rounded-bl-xl w-[80vw] max-w-sm sm:border border-slate-700 flex flex-col gap-5  shadow-2xl ` }>
                <h3 className="text-base  text-center text-gray-200 font-bold">Delete profile picture?</h3>
                <p className="text-sm text-gray-500 text-center">Deleting this picture will permanently remove it from your profile. This action cannot be undone. </p>
                <div className="flex gap-4 items-center justify-center">
                    
                    <button className="p-2 px-8 bg-slate-700 rounded-tr-md rounded-bl-md font-medium text-sm"
                    onClick={handleCancelDelete}
                    >
                        Cancel
                    </button>
                    <button className="p-2 px-6 bg-red-700 rounded-tr-md rounded-bl-md font-medium text-sm"
                    onClick={handleDeleteProfilePicture}
                    >
                       Yes, delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete