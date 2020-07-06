import React, { useState } from 'react'

type ThemeState = {
  theme: string,
  toggle: () => void,
}

export const ThemeContext = React.createContext<ThemeState | null>(null)

export const ThemeProvider: React.FC = (props) => {

  const [state, setState] = useState<ThemeState>({
    theme: localStorage.getItem('theme') || 'dark', // dark is default
    toggle: () => {
      setState((prevState: ThemeState) => {
        const toggledState = (prevState.theme === 'dark') ? 'light' : 'dark'
        localStorage.setItem('theme', toggledState)
        return ({ ...prevState, theme: toggledState })
      })
    }
  })

  return <ThemeContext.Provider value={state}>
    {props.children}
  </ThemeContext.Provider>
}
