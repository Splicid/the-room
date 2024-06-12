import React, { useEffect, useState, useRef } from 'react';
import { Socket, io } from "socket.io-client";
import '..//styling/main.css';

const socket = io('http://localhost:5000');
interface FormData {
    username: string;
    userId: string;
}

interface userError {
    formError: boolean;
}

const Main = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        userId: '',
    });
    
    const [errorState, setErrorState] = useState<userError>({
        formError: false,
    });
    
    const formDataRef = useRef(formData);

    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {
        socket.on('connect', () => {
            setFormData((prevFormData) => ({
                ...prevFormData,
                userId: socket.id || ''
            }));

            const handleBeforeUnload = () => {
                socket.emit('client_disconnected', { data: formDataRef.current });
                socket.disconnect();
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                socket.disconnect();
            };
        }).on('error', (error) => {

            console.log('Socket connection error:', error);
        })

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

        const postData = {
            username: formData.username,
            userId: formData.userId,
        };

        socket.on('userId', (data) => {
            console.log(data);
        });

        fetch('http://localhost:5000/', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(postData),
        })
        .then((response) => response.text())
        .then((data) => {
            // console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });

        socket.emit('client_connection', formData);
        console.log(formData);
    };

    return (
        <div className='username-form'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username" className='form-label'>Enter username:</label>
                <input className='username-input' value={formData.username} onChange={handleInput} type="text" name='username' />
                <button type='submit' className='username-button'> Submit </button>
            </form>
        </div>
    );
};

export default Main;
