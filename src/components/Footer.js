import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <p className="footer-description">
                "Maluku Travel Mate, dengan hutan tropis dan pantai yang eksotis."
            </p>
            <div className="social-icons">
                <a href="https://www.instagram.com/reel/DCeRBZ4P3CM/?igsh=ZXI3a3pxaHVxNXRw" target="_blank" rel="noopener noreferrer">
                    <i className='bx bxl-instagram-alt social-icon'></i>
                </a>
                <a href="https://vt.tiktok.com/ZSjcq7vuY/" target="_blank" rel="noopener noreferrer">
                    <i className='bx bxl-tiktok social-icon'></i>
                </a>
                <a href="https://youtube.com/shorts/SYeq02BSecc?si=GB-bEDCdvqQ71MBL" target="_blank" rel="noopener noreferrer">
                    <i className='bx bxl-youtube social-icon'></i>
                </a>
            </div>
        </footer>
    );
};

export default Footer;