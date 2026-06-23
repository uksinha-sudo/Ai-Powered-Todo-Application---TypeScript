

import { useRef } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { BACKEND_URL_USER } from "../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    async function onClickHandler() {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        try {
            const response = await axios.post(`${BACKEND_URL_USER}/signin`, {
                email,
                password
            });
            toast.success(response.data.message);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Status:", error.response?.status);
                console.log("Backend Error:", error.response?.data);
                toast.error(error.response?.data.message);
            } else {
                console.log("Unexpected Error:", error);
            }
        }
    }

    return (
        <>
            <div className="w-full h-screen bg-black/80 flex items-center justify-center">
                <div className="border border-blue-500 bg-black shadow-2xl rounded max-h-[60vh] w-[20vw] text-white flex flex-col gap-3 p-3">
                    <h2 className="m-auto font-bold text-2xl">Sign In</h2>
                    <div className="flex flex-col gap-3">
                        <Input reference={emailRef} type="email" placeholder="john@example.com" lable="Email" />
                        <Input reference={passwordRef} type="password" lable="Password" />
                    </div>
                    <div className="flex mt-3 m-auto mb-4">
                        <Button lable="Submit" styles="hover:bg-blue-500 bg-blue-300 text-black px-4" onClick={onClickHandler} />
                    </div>
                    <div className="flex justify-center mb-2">
                        <p>Not an user? <a href="/signup"><span className="text-blue-400 text-shadow-2xs">Create Account</span></a></p>
                    </div>
                </div>
            </div>
        </>
    )
}


export default SignIn;