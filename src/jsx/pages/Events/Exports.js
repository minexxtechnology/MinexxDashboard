import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { baseURL_ } from "../../../config";
import axiosInstance from '../../../services/AxiosInstance';
import { toast } from "react-toastify";
import { ThemeContext } from "../../../context/ThemeContext";
import { Logout } from '../../../store/actions/AuthActions';
import { useDispatch } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { Loader, Segment } from 'semantic-ui-react';
import QRCodeWithPrintButton from './QRCodeWithPrintButton';
import { translations } from './Exporttranslation';

const Exports = ({ language, country }) => {	  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { changeTitle } = useContext(ThemeContext);
    const [exports, setExports] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [tablehead, setTablehead] = useState([]);
    const [attachment, setAttachment] = useState();
    const [loading, setLoading] = useState(true);
    const access = localStorage.getItem(`_dash`) || '3ts';

    const fetchExports = async() => {
        try {
            setLoading(true);
            let normalizedCountry = country.trim();
            
            // Special handling for Rwanda
            if (normalizedCountry.toLowerCase() === 'rwanda') {
                // Randomly choose one of the three formats
                 normalizedCountry ='.Rwanda';
                // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
            } else {
                // For other countries, remove leading/trailing dots and spaces
                normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
            }
            console.log('Normalized Country:', normalizedCountry);
            let response = await axiosInstance.get(`exports`,
                {
                    params: {
                        country:normalizedCountry,
                      }
                });
                console.log('Export Endpoint Response:');
            console.log(`Total Exports Received: ${response.data.exports.length}`);
            console.log(`Response Timestamp: ${new Date().toISOString()}`);
            console.log('Export Details:', response.data.exports);
            setLoading(false);
            setExports(response.data.exports.reverse());
            
            setFiltered(response.data.exports.reverse());
        } catch (err) {
            setLoading(false);
            try {
                if (err.response.code === 403) {
                    dispatch(Logout(navigate));
                } else {
                    toast.warn(err.response.message);
                }
            } catch (e) {
                toast.error(err.message);
            }
        }
    };
    const t = (key) => {
        if (!translations[language]) {
          console.warn(`Translation for language "${language}" not found`);
          return key;
        }
        return translations[language][key] || key;
      };

    const showAttachment = (file, field) => {
        axiosInstance.post(`${baseURL_}image`, {
            file
        }).then(response => {
            setAttachment({image: response.data.image, field});
        }).catch(err => {
            try {
                if (err.response.code === 403) {
                    dispatch(Logout(navigate));
                } else {
                    toast.warn(err.response.message);
                }
            } catch(e) {
                toast.error(err.message);
            }
        });
    };

    const filter = (e) => {
        const input = e.currentTarget.value;
        if (access === '3ts') {
            setFiltered(exports.filter(exp => exp.exportationID.toLowerCase().includes(input.toLowerCase()) || exp.company.name.toLowerCase().includes(input.toLowerCase())));
        } else {
            setFiltered(exports.filter(exp => exp[tablehead.indexOf('Transaction Unique ID')]?.toLowerCase()?.includes(input.toLowerCase()) || exp[tablehead.indexOf('Name of processor/refiner/exporter')]?.toLowerCase()?.includes(input.toLowerCase()) || exp[tablehead.indexOf('Gold Export License Number')]?.toLowerCase()?.includes(input.toLowerCase())
            || exp[tablehead.indexOf('Type of minerals exported')]?.toLowerCase()?.includes(input.toLowerCase())));
        }
    };

    useEffect(() => {
        fetchExports();
        changeTitle(`Exports | Minexx`);
    }, [language,country]);

    return(
        <Segment>
            <Loader active={loading} />
            { attachment ? <Modal size='lg' show={attachment} onBackDropClick={() => setAttachment(null)}>
                <Modal.Header>
                    <h3 className='modal-title'>{attachment.field}</h3>
                    <Link className='modal-dismiss' data-toggle="data-dismiss" onClick={() => setAttachment(null)}>x</Link>
                </Modal.Header>
                <Modal.Body>
                    <img alt='' className='rounded mt-4' width={'100%'} src={`https://lh3.googleusercontent.com/d/${attachment.image}=w2160?authuser=0`}/>
                </Modal.Body>
            </Modal> : null }
            <div className="page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active"><Link to={"/overview"}>{t('Dashboard')}</Link></li>
                    <li className="breadcrumb-item"><Link to={""} >{t('Exports')}</Link></li>
                </ol>
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">{t('Exports')}</h4>
                            <div>
                                <input className="form-control" placeholder={t('search')} onChange={filter}/>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="w-100 table-responsive">
                                <div id="patientTable_basic_table" className="dataTables_wrapper">
                                    <table
                                        id="example5"
                                        className="display dataTable w-100 no-footer"
                                        role="grid"
                                        aria-describedby="example5_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th className="sorting_asc" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1} aria-sort="ascending">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id="checkAll" required />
                                                        <label className="custom-control-label" htmlFor="checkAll" />
                                                    </div>
                                                </th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('CompanyName')}</th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('ExportationID')}</th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('Date')}</th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('MineralType')}</th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('Grade')}</th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('NetWeight')}</th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('Track')}</th>
                                                <th className="sorting" tabIndex={0} aria-controls="example5" rowSpan={1} colSpan={1}>{t('QrCode')}</th> 
                                            </tr>
                                        </thead>
                                        {loading ? 
                                            <tbody>
                                                <tr><td colSpan={9}><center><Spinner size="md" style={{ margin: 15 }} role="status" variant="primary"><span className="visually-hidden">Loading...</span></Spinner></center></td></tr> 
                                            </tbody>
                                            : <tbody>
                                            {filtered.length === 0 ?
                                                <tr role="row" className="odd">
                                                    <td colSpan={9} className="sorting_1 text-center">{t('NoExportRecords')}</td>
                                                </tr>
                                                : filtered.map(_export => (
                                                    <tr role="row" key={_export.id} className="odd">
                                                        <td className="sorting_1">
                                                            <div className="custom-control custom-checkbox ">
                                                                <input type="checkbox" className="custom-control-input" id={`customCheckBox_${_export.id}`} required />
                                                                <label className="custom-control-label" htmlFor={`customCheckBox_${_export.id}`} />
                                                            </div>
                                                        </td>
                                                        <td><Link to={`/company/${_export?.company?.id}`}>{_export?.company?.name}</Link></td>
                                                        <td><Link className={_export.exportationID ? "text-primary" : "text-danger"} to={`/exports/${_export?.id}`}>{_export.exportationID ? _export.exportationID : "Exportation ID Missing"}</Link></td>
                                                        <td>{new Date(_export.date).toString().substring(0, 16)}</td>
                                                        <td>
                                                            <span className="badge light badge-warning">
                                                                <i className="fa fa-circle text-danger me-1" />
                                                                {_export.mineral}
                                                            </span>
                                                        </td>
                                                        <td>{_export.grade}</td>
                                                        <td>{access === '3ts' ? _export.netWeight : (_export.netWeight/1000).toFixed(2)}</td>
                                                        <td>{_export.link ? <a target="_blank" href={`${_export.link}`} className="text-primary" rel="noreferrer">Track Shipment</a> : <span className="text-warning">Tracking not available</span>}</td>
                                                        <td>
                                                        <QRCodeWithPrintButton value={`https://minexx-scann-mysql.vercel.app/export/${_export?.id}/${_export?.company?.id}/?x-platform=${_export.mineral === 'Gold' ? 'gold' : '3ts'}`} />
                                                        </td> 
                                                    </tr> 
                                                ))}
                                            </tbody>
                                        }
                                    </table> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Segment>
    );
};

export default Exports;