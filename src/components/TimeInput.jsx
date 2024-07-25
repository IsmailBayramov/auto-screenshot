import React, { useState } from 'react';

function TimeInput({ idPrefix, onChange }) {
    const handleChange = (index, event) => {
        const value = event.target.value;

        // Проверяем, что ввод - это цифра и значение в пределах от 0 до 9
        if (/^\d$/.test(value)) {
            onChange(index, value);
        } else {
            onChange(index, '');
        }

        // Устанавливаем фокус на следующее поле, если текущее поле заполнили
        if (value && index < 3) {
            document.getElementById(`${idPrefix}-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !event.target.value && index > 0) {
            document.getElementById(`${idPrefix}-${index - 1}`).focus();
        }
    };

    return (
        <div className={"flex items-center"}>
            {[0, 1, 2, 3].map((index) => (
                <React.Fragment key={index}>
                    <input
                        id={`${idPrefix}-${index}`}
                        type="text"
                        maxLength="1"
                        minLength="1"
                        placeholder={`${index}`}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={"bg-black w-[30px] h-[30px] text-[20px] mx-[2px] my-[0] rounded-[4px] border-[1px] border-solid border-[#ccc] text-center"}
                    />
                    {index === 1 && <span className={"text-[20px] mx-[5px] my-[0] select-none"}>:</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

export default TimeInput;