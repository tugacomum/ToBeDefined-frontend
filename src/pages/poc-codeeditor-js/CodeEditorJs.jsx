// src/pages/home/JsCompiler.jsx

import { useState, useEffect, use } from 'react'
import Editor from '@monaco-editor/react'
import Interpreter from 'js-interpreter'
import * as Babel from '@babel/standalone'
import './CodeEditorJs.css'

export default function CodeEditorJs() {
  const [code, setCode] = useState(`console.log("Olá, mundo!")`)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const div = document.getElementById('console-output')
    if (div) {
      div.scrollTop = div.scrollHeight
    }
  }, [logs])

const runCode = () => {
    setLogs([])

    const addLog = (type, ...messages) => {
      setLogs(logs => [...logs, { type, message: messages.map(String).join(' ') }])
    }

    let interpreter
    try {
      const es5 = Babel.transform(code, { presets: ['env'] }).code;
      interpreter = new Interpreter(es5, (interp, global) => {
        const consoleObj = interp.createObject(interp.OBJECT)

        const consoleMethods = (type) => interp.createNativeFunction(function () {
          const msgs = Array.from(arguments).map(msg => interp.pseudoToNative(msg))
          addLog(type, ...msgs)
        })

        interp.setProperty(consoleObj, 'log', consoleMethods('log'))
        interp.setProperty(consoleObj, 'error', consoleMethods('error'))
        interp.setProperty(global, 'console', consoleObj)
      })
    } catch (error) {
      addLog('error', error.message || String(error))
      return
    }

    const start = performance.now()
    const TIMEOUT_MS = 2000
    const STPER_PER_TICK = 1000

    const interval = setInterval(() => {
      try {
        for (let i = 0; i < STPER_PER_TICK; i++) {
          const hasMore = interpreter.step()
          if (!hasMore) { clearInterval(interval); return }
        }

        if (performance.now() - start > TIMEOUT_MS) {
          addLog('error', 'Execution timeout')
          clearInterval(interval)
        }
      } catch (error) {
        addLog('error', error.message || String(error))
        clearInterval(interval)
      }
    },0)
  }

  return (
    <div className="jspoc-container">
      <div className="editor-pane">
        <h3>Editor JS</h3>
        <Editor
          height="50vh"
          defaultLanguage="javascript"
          theme="vs-light"
          value={code}
          onChange={setCode}
        />
        <button onClick={runCode}>Run</button>
      </div>
      <div className="console-pane">
        <h3>Console</h3>
        <div id='console-output' className="console-output ">
          {logs.map((entry, i) => (
            <pre key={i} className={entry.type}>
              {entry.message}
            </pre>
          ))}
        </div>
      </div>
    </div>
  )
}
