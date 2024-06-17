import React, { useEffect, useState, useRef } from "react";
import { Socket, io } from "socket.io-client";
import "..//styling/main.css";

const socket = io('http://localhost:5000');
interface FormData {
    username: string;
    userId: string;
}

interface userError {
    formError: boolean;
}

interface textBoxError {
    textBox: boolean;
}

const Main = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        userId: '',
    });
    const [errorState, setErrorState] = useState<userError>({
        formError: false,
    });
    const [emptyForm, setEmptyForm] = useState<textBoxError>({
        textBox: false,
    })
    
    const formDataRef = useRef(formData);

    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {

        // Check if session cookie exists
        const userIdFromCookie = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (userIdFromCookie) {
            setFormData(prevFormData => ({
                ...prevFormData,
                userId: userIdFromCookie
            }));
        }

        socket.on('connect', () => {
            setFormData((prevFormData) => ({
                ...prevFormData,
                userId: socket.id || ''
            }));

            const invalidateCookie = () => {
                document.cookie = 'userId' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }

            const handleBeforeUnload = () => {
                // Removing cookie with userId data
                invalidateCookie();
                socket.emit('client_disconnected', { data: formDataRef.current });
                socket.disconnect();
            };
            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                socket.disconnect();
            };
        }).on('error', (error) => {
            setErrorState(prevState => ({ ...prevState, formError: true }));
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

    const setCookie = async (name: String, value: String, minutes: number) => {
        let now = new Date();
        const expiryTime = new Date(now.getTime() + minutes * 60000);
        document.cookie = `${name}=${value}; expires=${expiryTime.toUTCString()}; path=/;`;
    }

    const fetchData = async (postData) => {
        try {
            const response = await fetch('http://localhost:5000/', {
                method: 'POST',
                headers: new Headers({ 
                    'Content-Type': 'application/json',
                    'Cookie': document.cookie,
                 }),
                credentials: 'include',
                body: JSON.stringify(postData)
            })
            const data = await response.text();
            console.log(data)
            socket.emit('client_connection', formData);
        }
        catch (error){
            console.log(error);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (formData.username == null || formData.username == '')
            {
                setEmptyForm({textBox: true})
            }
            else{
                const postData = {
                    username: formData.username,
                    userId: formData.userId,
                };
                await setCookie("userId", formData.userId, 1);
                await fetchData(postData);
            }
    };

    return (
        <div className='username-form'>
            <form onSubmit={handleSubmit}>
                {errorState.formError ? (
                    <label htmlFor="username" className='form-label'>Invalid username pick another:</label>
                ) : (
                    <label htmlFor="username" className='form-label'>Enter username:</label>
                )}
                <input className={emptyForm.textBox ? ('username-error'): ('username-input')} value={formData.username} onChange={handleInput} type="text" name='username'/>
                <button type='submit' className='username-button'> Submit </button>
            </form>
        </div>
    );
};

export default Main;
