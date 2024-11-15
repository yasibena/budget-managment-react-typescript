import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Close } from '@mui/icons-material';

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
    color: '#aea9e4'
};

interface ModalProps {
    title?: string,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
    children: ReactNode,
    headerContent?: ReactNode,
    onSubmit: () => void;

}

export default function AppModal({
    title,
    open,
    onOpen,
    onClose,
    children,
    headerContent,
    onSubmit

}: ModalProps) {
    return (
        <div>
            <Button onClick={onOpen}>{title}</Button>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {
                        headerContent && (
                            <Typography variant='h6' component='h2' mb={1}>
                                {headerContent}
                            </Typography>
                        )
                    }
                    {children}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose} sx={{ position: 'absolute', top: 0, right: 0, color: '#9C3BCF' }}>
                            <Close />
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
