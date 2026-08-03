import { useState } from "react";
import { createContext } from "react";

export const playContext = createContext();

export const PlayProvider = ({children}) =>{

    const [current, setcurrent] = useState(null);

    return (
        <playContext.Provider value={{current,setcurrent}}>
            {children}
        </playContext.Provider>
    )
}