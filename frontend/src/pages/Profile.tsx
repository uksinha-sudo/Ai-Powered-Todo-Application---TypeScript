import { useEffect, useState } from "react";
import { ProfileIcon } from "../icons/ProfileIcon";
import axios from "axios";
import { BACKEND_URL_USER } from "../config";
import { toast } from "react-toastify";
import { BackIcon } from "../icons/BackIcon";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

interface ProfileInfo {
    username: string;
    email: string;
    _id: string;
    // profilePicture?: string; => TODO = Add profile picture
}


const Profile = () => {

    const [info, setInfo] = useState<ProfileInfo | null>(null);
    const navigate = useNavigate();

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

    function signOut() {
        try {
            localStorage.removeItem("token");
            navigate("/signin");
            toast.info("Logged Out");
        } catch (error) {
            console.log(error);
        }
    }


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

                <div className="bg-gray-300 mt-10 flex w-150 m-auto">
                    <div className="flex gap-5 flex-col p-3">
                        <p className="select-none">
                            Username:{" "}
                            <span className="text-blue-400 border border-black rounded font-bold p-2">
                                {info.username}
                            </span>
                        </p>

                        <p className="select-none">
                            Email:{" "}
                            <span className="text-blue-400 border border-black rounded p-2">
                                {info.email}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="mt-30 items-center justify-center flex flex-col">
                    <a href="/dashboard"><BackIcon style="w-10 border rounded-4xl bg-gray-300 p-2 cursor-pointer" /></a>
                    <p className="mt-1 font-semibold">Back</p>
                    <Button lable="Log out" styles="mt-20 px-4 bg-blue-300 hover:bg-blue-500 text-white border border-black" onClick={signOut} />
                </div>
            </div>
        )}
    </div>
);
}

export default Profile;