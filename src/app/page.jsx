"use client";

import { useState, useRef } from 'react';
import TimeInput from "@/components/TimeInput";

export default function Home() {
    const [startTime, setStartTime] = useState(['', '', '', '']);
    const [endTime, setEndTime] = useState(['', '', '', '']);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const successTimeoutRef = useRef(null);
    const errorTimeoutRef = useRef(null);

    const handleStartTimeChange = (index, value) => {
        const newStartTime = [...startTime];
        newStartTime[index] = value;
        setStartTime(newStartTime);
    };

    const handleEndTimeChange = (index, value) => {
        const newEndTime = [...endTime];
        newEndTime[index] = value;
        setEndTime(newEndTime);
    };

    const formatTime = (timeArray) => {
        return `${timeArray[0]}${timeArray[1]}:${timeArray[2]}${timeArray[3]}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        const schedule = `${formattedStartTime}-${formattedEndTime}`;

        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ schedule }),
            });

            if (response.ok) {
                setShowSuccess(true);
                if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
                successTimeoutRef.current = setTimeout(() => setShowSuccess(false), 3000);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            setShowError(true);
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = setTimeout(() => setShowError(false), 3000);
        }
    };

    const handleClose = (type) => {
        if (type === 'success') setShowSuccess(false);
        if (type === 'error') setShowError(false);
    };

    return (
        <div className={"flex items-center justify-center flex-col font-mono"}>
            <h1 className={"mt-5 select-none"}>Введите график работы</h1>
            <form onSubmit={handleSubmit} className={"flex flex-col flex-wrap"}>
                <div className={"flex justify-center my-5"}>
                    <TimeInput idPrefix="start-time" onChange={handleStartTimeChange}/>
                    <span className={"mx-2 select-none"}>-</span>
                    <TimeInput idPrefix="end-time" onChange={handleEndTimeChange}/>
                </div>
                <button className={"mt-5 hover:text-gray-500 duration-300 select-none"} type="submit">
                    Отправить
                </button>
            </form>

            <div className={"alerts"}>
                <div
                    id="toast-success"
                    className={`toast flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${showSuccess ? 'show' : ''}`}
                    role="alert"
                >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                             viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                        </svg>
                        <span className="sr-only">Check icon</span>
                    </div>
                    <div className="ml-3 text-sm font-normal">График успешно создан.</div>
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                        onClick={() => handleClose('success')}
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>

                <div
                    id="toast-danger"
                    className={`toast flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${showError ? 'show' : ''}`}
                    role="alert"
                >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                             viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                        </svg>
                        <span className="sr-only">Error icon</span>
                    </div>
                    <div className="ml-3 text-sm font-normal">Некорректный ввод.</div>
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                        onClick={() => handleClose('error')}
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
