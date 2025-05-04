import { useParams } from "react-router-dom"
import LoadingScreen from "./LoadingScreen";
import axiosInstance from "@/utils/axiosConfig";
import { HOST, VERIFY_SIGNUP } from "@/utils/constants";
import { useEffect } from "react";
import { storeTokens } from "@/utils/authUtils";
import { useAppStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const ActivateAccount = () => {
    const { token } = useParams();
    const { setUser } = useAppStore();
    const navigate = useNavigate();

    const verifyToken = async () => {
        try {
            const response = await axiosInstance.post(`${HOST}/${VERIFY_SIGNUP}/${token}`);
            if (response.data.success) {

                toast.success('Account activated successfully!', { theme: 'light' });

                // Store tokens in localStorage instead of cookies
                const { authToken, refreshToken, user } = response.data;
                storeTokens(authToken, refreshToken);

                // Set user in the global store immediately
                if (user) {
                    setUser(user);
                }

                // Navigate to chat page
                setTimeout(() => {
                    navigate('/chat');
                }, 1000);
            } else {
                toast.error(response.data.message, { theme: 'light' });
            }
        } catch (error) {
            toast.error(error.message, { theme: 'light' });
        }
    }

    useEffect(() => {
        verifyToken()
    }, [])


    return (
        <div className="flex items-center justify-center bg-slate-900 py-12">
            <LoadingScreen message="verifying" />
        </div>
    )
}

export default ActivateAccount