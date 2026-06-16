import Input from "../components/Input";


const SignUp = () => {
    return (
        <>
            <div className="w-full h-screen bg-black/80 flex items-center justify-center">
                <div className="border border-blue-500 bg-black shadow-2xl rounded h-[60vh] w-[20vw] text-white"> 
                    <Input type="text" placeholder="John Doe" lable="Username" />
                </div>
            </div>
        </>
    )
}


export default SignUp;