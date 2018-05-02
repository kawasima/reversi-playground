import React from 'react'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'

class EvaluationEditor extends React.Component {
  state = {
    value: ''
  }
  render() {
    return (
      <CodeMirror
        value={this.state.value}
        options={
          {
            extraKeys: {'Ctrl-Space': 'autocomplete'},
            mode: 'javascript',
            theme: 'material',
            width: 300

        }}
        onBeforeChange={(editor, data, value) => {
          this.setState({value});
        }}
        onChange={(editor, data, value) => {
        }}
        />
    )
  }
}

export default EvaluationEditor
