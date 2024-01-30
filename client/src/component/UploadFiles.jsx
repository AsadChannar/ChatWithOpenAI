import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const UploadFiles = () => {
    return (
        <div className='container'>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Choose File</Form.Label>
                <Form.Control type="file" />
            </Form.Group>
            <Button type="submit">Submit</Button>
        </div>
    )
}

export default UploadFiles;