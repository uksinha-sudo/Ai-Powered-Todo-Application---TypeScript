import { ProfileIcon } from "../icons/ProfileIcon";
const Navbar = () => {
    return (
        <>
            <div className="flex border-b-2 items-center justify-around h-20">
                <p> <span className="font-bold text-blue-500">Ai </span> Powered
                    <span className="font-bold text-red-500"> Todo </span> App</p>
                <a href="/profile"><ProfileIcon style="cursor-pointer size-8" /></a>

            </div>
   
        </>
    )
}


export default Navbar;