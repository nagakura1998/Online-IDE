import React, { useState, useEffect, useRef } from 'react';
import { Buffer } from 'buffer'
import axios from 'axios'
function App() {
    const [loading, setLoading] = useState(false);
   
    const languageMap = {
        "cpp": {
            id: 54,
        },
        "java": {
            id: 62,
        },
        "python": {
            id: 71,
        },
        "javascript": {
            id: 63,
        }
    }

    const encode = (str) => {
        return Buffer.from(str, "binary").toString("base64")
    }

    const decode = (str) => {
        return Buffer.from(str, 'base64').toString()
    }

    const postSubmission = async (language_id, source_code, stdin) => {
        const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': 'b4e5c5a05fmsh9adf6ec091523f8p165338jsncc58f31c26e1',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: JSON.stringify({
            language_id: language_id,
            source_code: source_code,
            stdin: stdin
        })
        };

        const res = await axios.request(options);
        return res.data.token
    }

    const getOutput = async (token) => {
        // we will make api call here
        const options = {
        method: 'GET',
        url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
            'X-RapidAPI-Key': '3ed7a75b44mshc9e28568fe0317bp17b5b2jsn6d89943165d8',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
        };

        // call the api
        const res = await axios.request(options);
        if (res.data.status_id <= 2) {
        const res2 = await getOutput(token);
        return res2.data;
        }
        return res.data;
    }

    async function runCode() {
        const languageEl = document.querySelector("#language-sel");
        var language = languageEl.options[languageEl.selectedIndex].value;
       
        const editor = ace.edit('editor');

        const language_id = languageMap[language].id;
        const source_code = encode(editor.getValue());
        
        const inputEl = document.querySelector("#input");

        const stdin = encode(inputEl.value);
        
        setLoading(true);
        // pass these things to Create Submissions
        const token = await postSubmission(language_id, source_code, stdin);
        
        const res = await getOutput(token);

        setLoading(false);

        const status_name = res.status.description;
        const decoded_output = decode(res.stdout ? res.stdout : '');
        const decoded_compile_output = decode(res.compile_output ? res.compile_output : '');
        const decoded_error = decode(res.stderr ? res.stderr : '');

        let final_output = '';
        if (res.status_id !== 3) {
            // our code have some error
            if (decoded_compile_output === "") {
            final_output = decoded_error;
            }
            else {
            final_output = decoded_compile_output;
            }
        }
        else {
            final_output = decoded_output;
        }

        console.log(status_name)
        console.log(decoded_output)
        $('#output').html(final_output);
    }
    function clearCode(){
        const editor = ace.edit('editor');
        editor.setValue("")
    }
    return (
      <>
        <br></br>
        {
           loading ? <div class="modal">
                        <div class="kinetic"></div> 
                    </div> : null
        }
        <button id="run" onClick={runCode}>Run</button>
        <button id="clr1" onClick={clearCode}>Clear</button>
        <br></br>
      </>
    );
  }
  
  export default App;
  