import { toast } from "react-toastify";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const navigate = useNavigate();
    

    function signOut(){
        try{
            localStorage.removeItem("token");
            navigate("/signin");
            toast.info("Logged Out");
        }catch(error) {
            console.log(error);
        }
    }

    /// NEXT TASK => Add user profile button here and make a user profile page

    return(
        <>
         <div className="flex border-b-2 items-center justify-around h-20">
            <p> <span className="font-bold text-blue-500">Ai </span> Powered 
            <span className="font-bold text-red-500"> Todo </span> App</p>
            <Button lable="Log out" styles="px-4 bg-blue-300 hover:bg-blue-500 text-white border border-black" onClick={signOut}/>
         </div>
        </>
    )
}


export default Navbar;