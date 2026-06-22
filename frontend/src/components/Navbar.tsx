import Button from "./Button";

const Navbar = () => {
    return(
        <>
         <div className="flex border-b-2 items-center justify-around h-20">
            <p> <span className="font-bold text-blue-500">Ai </span> Powered 
            <span className="font-bold text-red-500"> Todo </span> App</p>
            <Button lable="Log out" styles="px-4 bg-blue-300 hover:bg-blue-500 text-white border border-black" />
         </div>
        </>
    )
}


export default Navbar;