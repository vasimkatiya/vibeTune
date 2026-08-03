import { createContext, useState } from "react";

export const searchContext = createContext();

export const SearchProvider = ({children}) => {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <searchContext.Provider value={{searchResults, setSearchResults}}>
            {children}
        </searchContext.Provider>
    )
}