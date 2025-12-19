import React from 'react';
import { FaExclamationTriangle, FaTrash, FaCheck } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
    if (!isOpen) return null;

    const icons = {
        warning: <FaExclamationTriangle />,
        danger: <FaTrash />,
        success: <FaCheck />
    };

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className={`confirm-modal-icon ${type}`}>
                    {icons[type]}
                </div>
                <h3 className="confirm-modal-title">{title || 'Konfirmasi'}</h3>
                <p className="confirm-modal-text">{message || 'Apakah Anda yakin?'}</p>
                <div className="confirm-modal-buttons">
                    <button className="btn btn-secondary" onClick={onClose}>Batal</button>
                    <button 
                        className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`} 
                        onClick={() => { onConfirm(); onClose(); }}
                    >
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;