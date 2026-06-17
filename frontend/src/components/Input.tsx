interface inputProps {
    type: string;
    placeholder?: string;
    reference?: React.RefObject<HTMLInputElement | null>;
    lable: string;
    style?: string;
}

const defaultStyles = "border px-2 py-2 w-full outline-none"
 
const Input = (props: inputProps) => {
    return(
        <div className="flex flex-col gap-2">
        <p className="text-blue-300 ml-2 mt-2">{props.lable}</p>
        <input type={props.type} placeholder={props.placeholder} ref={props.reference} className={`${defaultStyles} ${props.style}`}/>
        </div>
    )
}

export default Input;