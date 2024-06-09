import React, {useState} from 'react'
import { Socket, io } from "socket.io-client"
import cors from "cors"
import '..//styling/main.css'


const Main = () => {

    const socket = io('http://127.0.0.1:5000');
    const [formData, setFormData] = useState({
        username: '',
    })

    const handleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        //Socket IO testing
        socket.on('connection', () => {
            console.log(socket.connected)
        })
        const postData = new FormData()

        postData.append('username', formData.username)
        fetch('http://localhost:5000/', {
            method: 'POST',
            headers: new Headers({'content-type': 'application/json'}),
            body: postData,
        })
            .then((response) => response.text())
            .then((data) => {
                //console.log(data)
            })
            .catch((error) => {
                console.log(error)
            })
        
    }

    return (
        <div className='username-form'>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className='form-label'>Enter username:</label>
            <input className='username-input' value={formData.username} onChange={handleInput} type="text" name='username' />
            <button type='submit' className='username-button'> Submit </button>
          </form>
        </div>
      )
    
}


export default Main;