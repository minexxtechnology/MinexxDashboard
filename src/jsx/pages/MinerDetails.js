// src/pages/MinerDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/AxiosInstance';
import { useDispatch } from 'react-redux';
import { Logout } from '../../store/actions/AuthActions';

// ── Lazy Image Button for Miner Details (matches export pattern) ────
const LazyImageButton = ({ minerId, field, fieldLabel, onShowImage, variant = 'link' }) => {
    const [loading, setLoading] = useState(false);
    const access = localStorage.getItem(`_dash`) || '3ts';

    const handleClick = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/minerfield/${minerId}`, {
                params: { field },
                headers: { 'x-platform': access }
            });
            
            const { fileId, fileContent } = res.data.file || {};
            
            if (!fileId) {
                toast.warn('No image available');
                return;
            }
            
            const driveId = fileContent || fileId;
            const fullSizeUrl = `https://lh3.googleusercontent.com/d/${driveId}=w2160?authuser=0`;
            const thumbnailUrl = `https://lh3.googleusercontent.com/d/${driveId}=w400?authuser=0`;
            
            onShowImage({ fullSizeUrl, thumbnailUrl, driveId }, fieldLabel);
        } catch (err) {
            console.error('Failed to load file:', err);
            toast.error('Failed to load image.');
        } finally {
            setLoading(false);
        }
    };

    if (variant === 'link') {
        return (
            <button
                className="btn btn-sm btn-link p-0 text-primary"
                onClick={handleClick}
                disabled={loading}
                title={fieldLabel}
                style={{ textDecoration: 'none' }}
            >
                {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                    <><i className="fa fa-eye me-1"></i> View</>
                )}
            </button>
        );
    }

    return (
        <button
            className={`btn btn-sm ${variant}`}
            onClick={handleClick}
            disabled={loading}
            title={fieldLabel}
        >
            {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
                <i className="fa fa-image"></i>
            )}
        </button>
    );
};

const MinerDetails = ({ language, country }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { changeTitle } = useContext(ThemeContext);

    const access = localStorage.getItem(`_dash`) || '3ts';
    const user = JSON.parse(localStorage.getItem(`_authUsr`));

    const [miner, setMiner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageField, setSelectedImageField] = useState('');
    
    // ── New states for auto-loading profile picture ──────────────────
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const [profilePicLoading, setProfilePicLoading] = useState(false);

    // Translation helper
    const t = (key) => {
        const translations = {
            en: {
                'Miner Details': 'Miner Details',
                'Dashboard': 'Dashboard',
                'Miners': 'Miners',
                'Back to List': 'Back to List',
                'Personal Information': 'Personal Information',
                'Mining Information': 'Mining Information',
                'Document': 'Document',
                'Copy of identity card (CNI) or passport': 'Copy of identity card (CNI) or passport',
                'Full Name': 'Full Name',
                'First Name': 'First Name',
                'Last Name': 'Last Name',
                'Contact': 'Contact',
                'Email': 'Email',
                'Gender': 'Gender',
                'Date of Birth': 'Date of Birth',
                'Place of Birth': 'Place of Birth',
                'Permanent Residence': 'Permanent Residence',
                'National ID': 'National ID',
                'Identification Card Number': 'Identification Card Number',
                'Mine/Concession Name': 'Mine/Concession Name',
                'Substance to be Mined': 'Substance to be Mined',
                'Province': 'Province',
                'Department': 'Department',
                'Locality': 'Locality',
                'Registration Date': 'Registration Date',
                'Place': 'Place',
                'Signature': 'Signature',
                'Profile Picture': 'Profile Picture',
                'Identification Card': 'Identification Card',
                'Artisanal Mining Card': 'Artisanal Mining Card',
                'Loading...': 'Loading...',
                'Miner not found': 'Miner not found',
                'View': 'View',
                'Not provided': 'Not provided',
                'No image available': 'No image available',
                'Miner ID': 'Miner ID',
                'Registration': 'Registration'
            },
            fr: {
                'Miner Details': 'Détails du mineur',
                'Dashboard': 'Tableau de bord',
                'Miners': 'Mineurs',
                'Back to List': 'Retour à la liste',
                'Personal Information': 'Informations personnelles',
                'Mining Information': 'Informations minières',
                'Document': 'Document',
                 'Copy of identity card (CNI) or passport': 'Copie de la carte d\'identité (CNI) ou du passeport',
                'Full Name': 'Nom complet',
                'First Name': 'Prénom',
                'Last Name': 'Nom',
                'Contact': 'Contact',
                'Email': 'E-mail',
                'Gender': 'Genre',
                'Date of Birth': 'Date de naissance',
                'Place of Birth': 'Lieu de naissance',
                'Permanent Residence': 'Résidence permanente',
                'National ID': 'ID National',
                'Identification Card Number': 'Numéro de carte d\'identité',
                'Mine/Concession Name': 'Nom de la mine/concession',
                'Substance to be Mined': 'Substance à extraire',
                'Province': 'Province',
                'Department': 'Département',
                'Locality': 'Localité',
                'Registration Date': 'Date d\'inscription',
                'Place': 'Lieu',
                'Signature': 'Signature',
                'Profile Picture': 'Photo de profil',
                'Identification Card': 'Carte d\'identité',
                'Artisanal Mining Card': 'Carte d\'exploitation artisanale',
                'Loading...': 'Chargement...',
                'Miner not found': 'Mineur non trouvé',
                'View': 'Voir',
                'Not provided': 'Non fourni',
                'No image available': 'Aucune image disponible',
                'Miner ID': 'ID du mineur',
                'Registration': 'Inscription'
            }
        };
        return translations[language]?.[key] || key;
    };

    // ── Load Miner Details ──────────────────────────────────────────────
    const loadMinerDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/miner/${id}`, {
                headers: { 'x-platform': access }
            });

            if (response.data.success) {
                setMiner(response.data.miner || null);
                if (!response.data.miner) {
                    toast.warn('Miner not found');
                }
            } else {
                toast.warn(response.data.message || 'Failed to load miner details');
            }
        } catch (err) {
            if (err.response?.status === 403) {
                dispatch(Logout(navigate));
            } else if (err.response?.status === 404) {
                toast.error('Miner not found');
                setMiner(null);
            } else {
                toast.error(err.response?.data?.message || 'Error loading miner details');
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Auto-load profile picture ──────────────────────────────────────
    useEffect(() => {
        const fetchProfilePic = async () => {
            if (!miner || !miner['Profile Picture']) {
                setProfilePicUrl(null);
                return;
            }
            
            setProfilePicLoading(true);
            try {
                const res = await axiosInstance.get(`/minerfield/${miner.ID}`, {
                    params: { field: 'Profile Picture' },
                    headers: { 'x-platform': access }
                });
                
                const { fileId, fileContent } = res.data.file || {};
                if (fileId) {
                    const driveId = fileContent || fileId;
                    setProfilePicUrl(`https://lh3.googleusercontent.com/d/${driveId}=w2160?authuser=0`);
                } else {
                    setProfilePicUrl(null);
                }
            } catch (err) {
                console.error('Failed to auto-load profile picture:', err);
                setProfilePicUrl(null);
            } finally {
                setProfilePicLoading(false);
            }
        };
        
        fetchProfilePic();
    }, [miner, access]);

    // ── Show Image Modal ──────────────────────────────────────────────
    const showImage = (imageData, field) => {
        if (!imageData || !imageData.fullSizeUrl) {
            toast.warn(t('No image available'));
            return;
        }
        setSelectedImage(imageData);
        setSelectedImageField(field);
        setShowModal(true);
    };

    // ── Handle Profile Picture Click ────────────────────────────────────
    const handleProfilePictureClick = () => {
        if (!profilePicUrl) {
            toast.warn('No profile picture available');
            return;
        }
        
        // Use the already resolved URL
        showImage({ 
            fullSizeUrl: profilePicUrl,
            thumbnailUrl: profilePicUrl.replace('=w2160', '=w400'),
            driveId: profilePicUrl.split('/d/')[1]?.split('=')[0] || ''
        }, t('Profile Picture'));
    };

    // ── Initialize ──────────────────────────────────────────────────────
    useEffect(() => {
        changeTitle(`${t('Miner Details')} | Minexx`);
        if (id) {
            loadMinerDetails();
        }
    }, [id, language, country]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('Loading...')}</span>
                </div>
                <p className="mt-2">{t('Loading...')}</p>
            </div>
        );
    }

    if (!miner) {
        return (
            <div className="text-center py-5">
                <i className="fa fa-user-slash fa-3x text-muted mb-3"></i>
                <h4>{t('Miner not found')}</h4>
                <p className="text-muted">The miner you're looking for doesn't exist</p>
                <Button as={Link} to="/3tsminers" variant="primary">
                    <i className="fa fa-arrow-left me-2"></i> {t('Back to List')}
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* Image Modal */}
            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedImageField || t('Image')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedImage ? (
                        <img
                            alt={selectedImageField || 'Image'}
                            className='rounded'
                            width={'100%'}
                            style={{ maxHeight: '600px', objectFit: 'contain' }}
                            src={selectedImage.fullSizeUrl || selectedImage.thumbnailUrl}
                            onError={(e) => {
                                e.target.src = '/assets/images/placeholder.png';
                            }}
                        />
                    ) : (
                        <p className="text-muted">{t('No image available')}</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* Breadcrumb Header */}
            <div className="page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active">
                        <Link to={"#"}>{t("Dashboard")}</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/3tsminers">{t("Miners")}</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={"#"}>{t("Miner Details")}</Link>
                    </li>
                </ol>
            </div>

            {/* Main Content - Compact Layout */}
            <div className='row'>
                <div className='col-12'>
                    {/* Header - More compact */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 className="mb-0">{t('Miner Details')}</h5>
                            <small className="text-muted">
                                <i className="fa fa-id-card me-1"></i> {t('Miner ID')}: {miner.ID}
                            </small>
                        </div>
                        <Button as={Link} to="/3tsminers" variant="secondary" size="sm">
                            <i className="fa fa-arrow-left me-2"></i> {t('Back to List')}
                        </Button>
                    </div>

                    <Row className="align-items-stretch">
                        {/* Profile Card - Left Column */}
                        <Col lg={3} md={4} className="d-flex">
                            <Card className="mb-3 shadow-sm w-100">
                                <Card.Body className="text-center p-3 d-flex flex-column">
                                    {miner['Profile Picture'] ? (
                                        <div className="position-relative d-inline-block mx-auto">
                                            {profilePicLoading ? (
                                                <div
                                                    className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 border border-3 border-primary"
                                                    style={{ width: '120px', height: '120px' }}
                                                >
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={profilePicUrl || '/assets/images/avatar.png'}
                                                    alt={miner['First Name']}
                                                    className="rounded-circle mb-2 border border-3 border-primary"
                                                    style={{ 
                                                        width: '120px', 
                                                        height: '120px', 
                                                        objectFit: 'cover', 
                                                        cursor: 'pointer',
                                                        padding: '3px'
                                                    }}
                                                    onClick={handleProfilePictureClick}
                                                    onError={(e) => {
                                                        e.target.src = '/assets/images/avatar.png';
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div 
                                            className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 border border-3 border-primary"
                                            style={{ width: '120px', height: '120px' }}
                                        >
                                            <i className="fa fa-user fa-4x text-secondary"></i>
                                        </div>
                                    )}
                                    <h5 className="mb-0">{miner['First Name']} {miner['Last Name']}</h5>
                                    <Badge bg={miner.Gender === 'Male' ? 'info' : miner.Gender === 'Female' ? 'warning' : 'secondary'} className="mt-1">
                                        {miner.Gender || t('Not provided')}
                                    </Badge>
                                    <hr className="my-2" />
                                    <div className="text-start flex-grow-1" style={{ fontSize: '13px' }}>
                                        <p className="mb-1">
                                            <i className="fa fa-envelope text-primary me-2" style={{ width: '18px' }}></i>
                                            <strong>{t('Email')}:</strong> {miner.Email || t('Not provided')}
                                        </p>
                                        <p className="mb-1">
                                            <i className="fa fa-phone text-success me-2" style={{ width: '18px' }}></i>
                                            <strong>{t('Contact')}:</strong> {miner.Contact || t('Not provided')}
                                        </p>
                                        <p className="mb-0">
                                            <i className="fa fa-calendar text-info me-2" style={{ width: '18px' }}></i>
                                            <strong>{t('Registration Date')}:</strong> {miner.formattedDateTime || '-'}
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Details Cards - Right Column */}
                        <Col lg={9} md={8} className="d-flex">
                            <div className="w-100 d-flex flex-column">
                                <Row className="flex-grow-1 mb-3">
                                    <Col lg={6} className="d-flex">
                                        {/* Personal Information - Compact */}
                                        <Card className="shadow-sm w-100">
                                            <Card.Body className="py-2">
                                                <Row>
                                                    <Col sm={6}>
                                                        <div className="mb-1">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Date of Birth')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner.formattedDateOfBirth || '-'}</p>
                                                        </div>
                                                        <div className="mb-1">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Place of Birth')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner['Place of Birth'] || '-'}</p>
                                                        </div>
                                                        <div className="mb-0">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Permanent Residence')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner['Permanent residence'] || '-'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-1">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('National ID')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner['National ID'] || t('Not provided')}</p>
                                                        </div>
                                                        <div className="mb-0">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Identification Card Number')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner['Identification Card Number'] || '-'}</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col lg={6} className="d-flex">
                                        {/* Mining Information - Compact */}
                                        <Card className="shadow-sm w-100">
                                            <Card.Body className="py-2">
                                                <Row>
                                                    <Col sm={6}>
                                                        <div className="mb-1">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Mine/Concession Name')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>
                                                                <i className="fa fa-industry me-1 text-primary" style={{ fontSize: '12px' }}></i>
                                                                {miner['Mine/Concession Name'] || '-'}
                                                            </p>
                                                        </div>
                                                        <div className="mb-0">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Substance to be Mined')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>
                                                                <i className="fa fa-cube me-1 text-warning" style={{ fontSize: '12px' }}></i>
                                                                {miner['Substance to be Mined'] || '-'}
                                                            </p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-1">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Province')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>
                                                                <i className="fa fa-map-marker me-1 text-danger" style={{ fontSize: '12px' }}></i>
                                                                {miner.Province || '-'}
                                                            </p>
                                                        </div>
                                                        <div className="mb-0">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Department')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner.Department || '-'}</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row className="flex-grow-1">
                                    <Col md={12} className="d-flex">
                                        {/* Documents & Registration - Full Width, Compact */}
                                        <Card className="shadow-sm w-100">
                                            <Card.Body className="py-2">
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-1">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Registration Date')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner.formattedDateTime || '-'}</p>
                                                        </div>
                                                        <div className="mb-0">
                                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Place')}</label>
                                                            <p className="mb-0" style={{ fontSize: '13px' }}>{miner.Place || '-'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        {miner['Identification Card'] && (
                                                            <div className="mb-1">
                                                                <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Identification Card')}</label>
                                                                <p className="mb-0">
                                                                    <LazyImageButton
                                                                        minerId={miner.ID}
                                                                        field="Identification Card"
                                                                        fieldLabel={t('Identification Card')}
                                                                        onShowImage={showImage}
                                                                        variant="link"
                                                                    />
                                                                </p>
                                                            </div>
                                                        )}
                                                        {miner['Artisanal Mining Card'] && (
                                                            <div className="mb-1">
                                                                <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Artisanal Mining Card')}</label>
                                                                <p className="mb-0">
                                                                    <LazyImageButton
                                                                        minerId={miner.ID}
                                                                        field="Artisanal Mining Card"
                                                                        fieldLabel={t('Artisanal Mining Card')}
                                                                        onShowImage={showImage}
                                                                        variant="link"
                                                                    />
                                                                </p>
                                                            </div>
                                                        )}
                                                        {miner.Signature && (
                                                            <div className="mb-1">
                                                                <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Signature')}</label>
                                                                <p className="mb-0">
                                                                    <LazyImageButton
                                                                        minerId={miner.ID}
                                                                        field="Signature"
                                                                        fieldLabel={t('Signature')}
                                                                        onShowImage={showImage}
                                                                        variant="link"
                                                                    />
                                                                </p>
                                                            </div>
                                                        )}
                                                        {miner['Copy of identity card (CNI) or passport'] && (
                                                            <div className="mb-0">
                                                                <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{t('Copy of identity card (CNI) or passport')}</label>
                                                                <p className="mb-0">
                                                                    <LazyImageButton
                                                                        minerId={miner.ID}
                                                                        field="Copy of identity card (CNI) or passport"
                                                                        fieldLabel={t('Copy of identity card (CNI) or passport')}
                                                                        onShowImage={showImage}
                                                                        variant="link"
                                                                    />
                                                                </p>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default MinerDetails;