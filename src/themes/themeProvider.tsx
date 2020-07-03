import React, { useState } from 'react'

type ThemeState = {
  dark: boolean,
  toggle: () => void,
}

export const ThemeContext = React.createContext<ThemeState | null>(null)

export const ThemeProvider: React.FC = (props) => {

  const [state, setState] = useState<ThemeState>({
    dark: true,
    toggle: () => setState((prevState: ThemeState) => ({ ...prevState, dark: !prevState.dark })),
  })

  return <ThemeContext.Provider value={state}>
    {props.children}
  </ThemeContext.Provider>
}
