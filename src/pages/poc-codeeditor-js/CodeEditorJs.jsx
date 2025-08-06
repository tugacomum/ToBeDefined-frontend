// src/pages/home/JsCompiler.jsx

import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import './CodeEditorJs.css'

export default function CodeEditorJs() {
  const iframeRef = useRef(null)
  const [code, setCode] = useState(`console.log("Olá, mundo!")`)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data || (event.data.type !== 'log' && event.data.type !== 'error')) return
      setLogs(logs => [...logs, {type: event.data.type, message: event.data.message }])
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

const runCode = () => {
    setLogs([])

    const escapedCode = JSON.stringify(code)
    
    const srcDoc = `
      <!DOCTYPE html>
      <html lang="pt-PT">
        <head><meta charset="utf-8"/></head>
        <body>
          <script>
            const send = msg => parent.postMessage(msg, '*')
            console.log = (...args) => send({ type: 'log', message: args.join(' ') })
            console.error = (...args) => send({ type: 'error', message: args.join(' ') })

            let finished = false
            setTimeout(() => {
              if (!finished) {
                console.error('Execution timeout.')
              }
            }, 2000)

            try {
              new Function('console',${escapedCode})(console)
            } catch (err) {
              console.error(err.message)
            } finally {
              finished = true
            }
          </script>
        </body>
      </html>
    `
    iframeRef.current.srcdoc = srcDoc
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
        <div className="console-output">
          {logs.map((entry, i) => (
            <pre key={i} className={entry.type}>
              {entry.message}
            </pre>
          ))}
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="js-poc"
        sandbox="allow-scripts"
        style={{ display: 'none' }}
      />
    </div>
  )
}
