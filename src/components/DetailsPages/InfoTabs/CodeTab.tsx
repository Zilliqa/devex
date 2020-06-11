import React from 'react'
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-ocaml"
import "ace-builds/src-noconflict/theme-textmate"

interface IProps {
  code: string
}

const CodeTab: React.FC<IProps> = ({ code }) => {
  return (
    <>
      <AceEditor
        mode="ocaml"
        theme="textmate"
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
