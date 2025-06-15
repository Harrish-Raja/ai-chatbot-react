import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Lottie from 'lottie-react'
import AIAnimation from './assets/Animation_AI.json'
import axios from 'axios'

function App() {

  const ai_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCrUKshq4q12CjKe9SpmMJ-j26rLv7c5ek"
  const [suggestions, setSuggestions] = useState([
    "what is react?", "what is javascript?", "How to build ai chatbot?"
  ])

  const [message, setmessage] = useState([]);
  const [input, setInput] = useState("")

  const handleSubmit = async () => {
    let usermessage = { sender: "user", text: input };
    setmessage(prev => [...prev, usermessage]);
    try {
      const response = await axios.post(ai_url, {
        contents: [
          {
            parts: [
              {
                "text": input
              }
            ]
          }
        ]
      })

      if (response.data) {
        let aimessage = { sender: "AI", text: response.data.candidates[0].content.parts[0].text };
        setmessage(prev => [...prev, aimessage]);
      }

    } catch (error) {
      let errormessage = { sender: "AI", text: "Sorry, I am unable to answer your question at the moment. Please try again later." };
      setmessage(prev => [...prev, errormessage]);
    }

    setInput("")
  }

  return (
    <div className='vh-100'>
      <div className='container h-100'>
        <div className='card border-0 shadow-sm bg-transparent h-100'>
          <div className='card-body'>
            <div className='d-flex justify-content-center align-items-center'>
              <div className='my-4'>
                <Lottie animationData={AIAnimation} style={{ width: "10rem" }} />
              </div>
            </div>

            <div className='row row-cols-4'>
              {
                suggestions.map((currEle, index) => {
                  return (
                    <div className='col' key={index}>
                      <div className='card border-0 shadow-sm suggestion-card h-100'>
                        <div className='card-body d-flex justify-content-center align-items-center'>
                          <p className='card-text'>
                            {currEle}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>

            {
              message.length > 0 ?
                <>
                  {
                    message.map((currEle, index) => {
                      return (
                        <div className={`${currEle.sender}-response-messages`} key={index}>
                          <p className='mb-0'>
                            {currEle.text}
                          </p>
                        </div>
                      )
                    })
                  }
                </>
                : null
            }

            <div></div>
          </div>

          <div className='card-footer'>
            <div className='input-group'>
              <input
                type="text"
                className='form-control'
                placeholder='Ask me anything...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className='btn btn-primary' onClick={() => handleSubmit()}>send</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
