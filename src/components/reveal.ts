import { createContext, useContext } from 'react'

/** True once the surrounding preview has been on screen, so entrance animations start when seen. */
export const RevealContext = createContext(true)

export const useRevealed = () => useContext(RevealContext)
