import { useEffect, useState } from "react";
import { ProfileIcon } from "../icons/ProfileIcon";
import axios from "axios";
import { BACKEND_URL_USER } from "../config";
import { toast } from "react-toastify";

interface ProfileInfo {
    username: string;
    email: string;
    _id: string;
    // profilePicture?: string; => TODO = Add profile picture
}


const Profile = () => {

    const [info, setInfo] = useState<ProfileInfo | null>(null);

    const fetchUserInfo = async() => {
        const token = localStorage.getItem("token");
        try{

            const response = await axios.get(`${BACKEND_URL_USER}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });   
            setInfo(response.data.user);
        } catch(error){
            if (axios.isAxiosError(error)) {
                console.log("Status:", error.response?.status);
                console.log("Backend Error:", error.response?.data);
                toast.error(error.response?.data.message);
            } else {
                console.log("Unexpected Error:", error);
            }
        }
    }

    useEffect(() => {
        fetchUserInfo();
    },[]);

return (
    <div className="h-screen w-full bg-slate/40">
        {info && (
            <div className="h-screen w-200 bg-black/20 m-auto">
                <div className="flex justify-center flex-col items-center">
                    <ProfileIcon style="w-20 mt-10" />
                    <p className="text-2xl mt-2">
                        Hello,{" "}
                        <span className="text-blue-500 font-bold text-2xl">
                            {info.username}
                        </span>
                    </p>
                </div>

                <div className="bg-amber-50 mt-10 flex w-150 m-auto">
                    <div className="flex gap-5 flex-col p-3">
                        <p>
                            Username:{" "}
                            <span className="text-blue-400 border border-black rounded font-bold p-2">
                                {info.username}
                            </span>
                        </p>

                        <p>
                            Email:{" "}
                            <span className="text-blue-400 border border-black rounded p-2">
                                {info.email}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="bg-amber-200">
                    {/* add back icon */}
                    {/* add sign out button */}
                </div>
            </div>
        )}
    </div>
);
}

export default Profile;