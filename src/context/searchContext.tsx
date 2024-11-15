import { createContext, useReducer, ReactNode, ReactElement } from "react";


interface SearchState<T> {
    searchTerm: string,
    results: T[]
}

const intialSearchState: SearchState<any> = {
    searchTerm: '',
    results: []
}

enum SEARCH_ACTION_TYPE {
    SET_SEARCH_TERM,
    SET_SEARCH_RESULTS,

}

interface SearchAction<T> {
    type: SEARCH_ACTION_TYPE;
    payload?: T | string
}

const searchReducer = <T,>(state: SearchState<T>, action: SearchAction<T>): SearchState<T> => {
    switch (action.type) {
        case SEARCH_ACTION_TYPE.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload as string
            }
        case SEARCH_ACTION_TYPE.SET_SEARCH_RESULTS:
            return {
                ...state,
                results: action.payload as T[]
            }
        default: throw new Error('Unknown action type')
    }
}

const useSearchContext = () => {
    const [state, dispatch] = useReducer(searchReducer, intialSearchState)

    const setSearchItem = (term: string) => {
        dispatch({ type: SEARCH_ACTION_TYPE.SET_SEARCH_TERM, payload: term })
    }

    const setSearchResult = <T,>(results: T[]) => {
        dispatch({ type: SEARCH_ACTION_TYPE.SET_SEARCH_RESULTS, payload: results })
    }

    return { state, setSearchItem, setSearchResult }

}

type SearchContextType = ReturnType<typeof useSearchContext>

const initialContextState: SearchContextType = {
    state: intialSearchState,
    setSearchItem: () => { },
    setSearchResult: () => { }
}

export const SearchContext = createContext<SearchContextType>(initialContextState)

type SearchProviderProps = { children: ReactNode }

export const SearchProvider = ({ children }: SearchProviderProps):ReactElement => {
    const searchContextValue = useSearchContext()

    return (
        <SearchContext.Provider value={searchContextValue}>
            {children}
        </SearchContext.Provider>
    )

}

export { useSearchContext };