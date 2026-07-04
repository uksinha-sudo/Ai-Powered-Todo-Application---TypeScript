import { motion } from "motion/react"

const defaultStyles = "px-2 py-2 rounded cursor-pointer border"

interface buttonProps { 
    lable: string;
    styles?: string;
    onClick?: () => void;
}

const Button = (props : buttonProps) => {
    return(
        <>
            <motion.button whileHover={{scale: 1.07}} whileTap={{scale: 0.95}} className={`${defaultStyles} ${props.styles}`} onClick={props.onClick}>{props.lable}</motion.button>
        </>
    )
}

export default Button;