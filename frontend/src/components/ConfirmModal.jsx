import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
    if (!isOpen) return null;

    const icons = {
        warning: <FaExclamationTriangle size={50} color="#f59e0b" />,
        danger: <FaTimesCircle size={50} color="#ef4444" />,
        success: <FaCheckCircle size={50} color="#22c55e" />,
        info: <FaInfoCircle size={50} color="#3b82f6" />
    };

    const buttonColors = {
        warning: 'var(--gold)',
        danger: '#ef4444',
        success: '#22c55e',
        info: '#3b82f6'
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()} style={{
                maxWidth: 380,
                padding: '30px 25px',
                textAlign: 'center'
            }}>
                {/* Icon - Centered */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 20
                }}>
                    {icons[type]}
                </div>

                {/* Title - Centered */}
                <h3 style={{
                    margin: '0 0 15px',
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#1f2937',
                    textAlign: 'center'
                }}>
                    {title}
                </h3>

                {/* Message - Centered */}
                <p style={{
                    margin: '0 0 25px',
                    color: '#6b7280',
                    fontSize: 14,
                    lineHeight: 1.6,
                    textAlign: 'center'
                }}>
                    {message}
                </p>

                {/* Buttons - Full width, stacked on mobile */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 20px',
                            border: '2px solid #e5e7eb',
                            borderRadius: 8,
                            background: '#fff',
                            color: '#374151',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: 8,
                            background: buttonColors[type],
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;