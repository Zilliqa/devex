
import React, { useContext } from 'react'
import AceEditor from 'react-ace'

import { ThemeContext } from 'src/themes/themeProvider'

import "ace-builds/src-noconflict/mode-ocaml"
import "ace-builds/src-noconflict/theme-textmate"
import "ace-builds/src-noconflict/theme-solarized_dark"

interface IProps {
  code: string
}

const CodeTab: React.FC<IProps> = ({ code }) => {

  const themeContext = useContext(ThemeContext)
  const { theme } = themeContext!

  return (
    <>
      <div className='code-block'>
        <AceEditor
          mode="ocaml"
          theme={theme === 'dark' ? "solarized_dark" : "textmate"}
          width="100%"
          fontSize='12px'
          name="ace_editor"
          style={{ borderRadius: '10px' }}
          readOnly={true}
          value={code}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    </>
  )
}

export default CodeTab
