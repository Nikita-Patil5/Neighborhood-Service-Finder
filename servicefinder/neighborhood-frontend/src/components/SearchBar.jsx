import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <Form>
            <InputGroup>
                <Form.Control
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary">Search</Button>
            </InputGroup>
        </Form>
    );
};

export default SearchBar;
