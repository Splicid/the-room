import React, {useEffect, useState} from 'react'
import { Socket, io } from "socket.io-client"
import cors from "cors"
import '..//styling/main.css'

const socket = io('http://localhost:5000');
interface FormData {
    username: string;
    userId: string;
}


const Main = () => {

    const [formData, setFormData] = useState<FormData>({
        username: '',
        userId: '',
    })

    useEffect(() => {
        socket.on('connect', () => {
            setFormData((prevFormData) => ({
                ...prevFormData,
                userId: socket.id || ''
            }));
        });

    }, []);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const postData = new FormData()
        postData.append('username', formData.username)
        postData.append('userId', formData.userId)

        socket.on('userId', (data) => {
            console.log(data)
        })

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
        
        socket.emit('message', formData);
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