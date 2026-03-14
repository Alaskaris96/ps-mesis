'use client';

import React, { useState } from 'react';
import { Select, components } from 'react-select';
import { DropdownIndicator, Option } from './ui/select';

const Dropdown = components.DropdownIndicator;
const DropdownIndicatorCustom = () => <Dropdown />;

const SearchableDropdown = ({ options, searchKey }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    return (
        <Select
            components={{ DropdownIndicator: DropdownIndicatorCustom }}
            options={options}
            onMenuOpen={() => {}}
            onMenuClose={() => {}}
            onChange={handleChange}
            value={selectedOption}
            placeholder="Search..."
            filterOption={(option, inputValue) => option.label.toLowerCase().includes(inputValue.toLowerCase())}
            styles={{
                control: (provided) => ({
                    ...provided,
                    width: '200px',
                }),
                input: (provided) => ({
                    ...provided,
                    padding: '8px',
                }),
                menu: (provided) => ({
                    ...provided,
                    width: '200px',
                }),
                option: (provided, { isDisabled }) => ({
                    ...provided,
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor: isDisabled ? '#f0f0f0' : 'white',
                }),
            }}
        />
    );
};

export default SearchableDropdown;
</write_to_file>