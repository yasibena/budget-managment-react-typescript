import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1d1933',
    border: '2px solid #2f2b43',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
    color: '#aea9e4',
};

interface ModalProps {
    open: boolean,
    onClose: () => void,
    children: ReactNode,
    onSubmit: () => void;
}

export default function DeleteModal({
    open,
    onClose,
    children,
    onSubmit

}: ModalProps) {
    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {children}
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                        <Button onClick={onSubmit} variant="contained" sx={{ bgcolor: '#e2474e', fontSize: '0.7rem' }}>Remove</Button>
                        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#9C3BCF', fontSize: '0.7rem' }}>Cancle</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
