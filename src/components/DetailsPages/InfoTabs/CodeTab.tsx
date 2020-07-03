import React, { useContext } from 'react'
import AceEditor from 'react-ace'

import { ThemeContext } from 'src/themes/themeProvider'

import "ace-builds/src-noconflict/mode-ocaml"
import "ace-builds/src-noconflict/theme-textmate"
import "ace-builds/src-noconflict/theme-idle_fingers"

interface IProps {
  code: string
}

const CodeTab: React.FC<IProps> = ({ code }) => {
  
  const themeContext = useContext(ThemeContext)
  const { dark } = themeContext!

  return (
    <>
      <AceEditor
        mode="ocaml"
        theme={dark ? "idle_fingers" : "textmate"}
        width="100%"
        fontSize='14px'
        name="ace_editor"
        readOnly={true}
        value={code}
        editorProps={{ $blockScrolling: true }}
      />
    </>
  )
}

export default CodeTab
