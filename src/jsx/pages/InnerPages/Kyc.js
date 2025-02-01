import React, { useState, useEffect } from 'react';
import { Tab, Nav, ListGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Kyc = () => {
  const [company, setCompany] = useState(null);
  const [companyDocs, setCompanyDocs] = useState([]);
  const [shareholder, setShareholder] = useState([]);
  const [beneficial, setBeneficial] = useState([]);
  const [loading, setLoading] = useState(true);
  const platform = localStorage.getItem('_dash') || '3ts';

  useEffect(() => {
    fetchCompanyData();
  });

  const fetchCompanyData = async () => {
    try {
      // Fetch company info
      const companyResponse = await fetch(
        `https://minexxapi-db-426415920655.us-central1.run.app/companiesnoAuth/ce62eb6o`,
        {
          method: 'GET',
          headers: {
            'x-platform': platform
          }
        }
      );
      if (!companyResponse.ok) {
        throw new Error('Network response was not ok for company details');
      }
      const companyData = await companyResponse.json();
      setCompany(companyData);
      console.log("Company Data", companyData);

      // Fetch documents
      const companyDocResponse = await fetch(
        `https://minexxapi-db-426415920655.us-central1.run.app/documentsnoAuth/ce62eb6o`,
        {
          method: 'GET',
          headers: {
            'x-platform': platform
          }
        }
      );
      if (!companyDocResponse.ok) {
        throw new Error('Network response was not ok for documents');
      }
      const companyDocData = await companyDocResponse.json();
      setCompanyDocs(companyDocData.documents);
      console.log("Company Document Data", companyDocData);

      // Fetch shareholders
      const shareholderResponse = await fetch(
        `https://minexxapi-db-426415920655.us-central1.run.app/shareholdersnoAuth/ce62eb6o`,
        {
          method: 'GET',
          headers: {
            'x-platform': platform
          }
        }
      );
      if (!shareholderResponse.ok) {
        throw new Error('Network response was not ok for shareholders');
      }
      const shareholderData = await shareholderResponse.json();
      setShareholder(shareholderData.shareholders);
      console.log("Shareholder Data", shareholderData.shareholders);

      // Fetch beneficial owners
      const beneficialResponse = await fetch(
        `https://minexxapi-db-426415920655.us-central1.run.app/ownersnoAuth/ce62eb6o`,
        {
          method: 'GET',
          headers: {
            'x-platform': platform
          }
        }
      );
      if (!beneficialResponse.ok) {
        throw new Error('Network response was not ok for beneficial owners');
      }
      const beneficialData = await beneficialResponse.json();
      setBeneficial(beneficialData.beneficial_owners);

      setLoading(false);
    } catch (err) {
      // toast.error('Error fetching company data');
      console.error('Error fetching company data:', err);
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="row page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active"><Link to={"/overview"}>Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to={"/mines"}>Mines</Link></li>
          <li className="breadcrumb-item"><Link to={""}>Kyc</Link></li>
        </ol>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Tab.Container defaultActiveKey="basic">
          <div className='col-xl-12'>
            <div className="card">
              <div className="card-body px-4 py-3 py-md-2">
                <div className="row align-items-center">
                  <div className="col-sm-12 col-md-7">
                    <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link px-2 px-lg-3" to="#basic" role="tab" eventKey="basic">
                          Basic Info
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link px-2 px-lg-3" to="#documents" role="tab" eventKey="documents">
                          Documents
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link px-2 px-lg-3" to="#shareholders" role="tab" eventKey="shareholders">
                          Shareholders
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link px-2 px-lg-3" to="#beneficialOwners" role="tab" eventKey="beneficialOwners">
                          Beneficial Owners
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12 col-xxl-12">
            <Tab.Content>
              <Tab.Pane eventKey="basic" id="basic">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6">
                        {company && company.company && (
                          <>
                            <h4 className="text-primary mb-2 mt-4">Company Name</h4>
                            <Link className="text-light" style={{ textDecoration: 'none' }}>{company.company.name}</Link>
                            <h4 className="text-primary mb-2 mt-4">Company Address</h4>
                            <Link className="text-light" style={{ textDecoration: 'none' }}>{company.company.address}</Link>
                            <h4 className="text-primary mb-2 mt-4">Company Country</h4>
                            <Link className="text-light" style={{ textDecoration: 'none' }}>{company.company.country}</Link>
                            <h4 className="text-primary mb-2 mt-4">Company Number</h4>
                            <Link className="text-light" style={{ textDecoration: 'none' }}>{company.company.number}</Link>
                            <h4 className="text-primary mb-2 mt-4">Company Type</h4>
                            <Link className="text-light" style={{ textDecoration: 'none' }}>{company.company.type}</Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="documents" id="documents">
                <div className="card">
                  <div className="card-body">
                    {companyDocs.length > 0 ? (
                      <ListGroup>
                        {companyDocs.map((document, index) => (
                          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            <span className="accordion-body">{document.type}</span>
                            <div className="mt-3 d-flex gap-2">
                              <a
                                target="_blank"
                                className="btn btn-info"
                                href={`https://drive.google.com/file/d/${document.file}/preview`}
                                rel="noreferrer"
                              >
                                View
                              </a>
                              <a
                                target="_blank"
                                className="btn btn-primary"
                                href={`https://drive.usercontent.google.com/download?id=${document.file}&export=download&authuser=0`}
                                rel="noreferrer"
                              >
                                Download
                              </a>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-light">No documents available</p>
                    )}
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="shareholders" id="shareholders">
                <div className="card">
                  <div className="card-body">
                    {shareholder.length > 0 ? (
                      <div>
                        {shareholder.map((document, index) => (
                          <div key={index}>
                            <h4 className="text-primary mb-2 mt-4">Name: {document.name}</h4>
                            <h4 className="text-light mb-2 mt-4">Percentage Owned: {document.percent}%</h4>
                            <h4 className="text-light mb-2 mt-4">Nationality: {document.nationality}</h4>
                            <h4 className="text-light mb-2 mt-4">Address: {document.address}</h4>
                            <iframe
                              title={document.name}
                              src={`https://drive.google.com/file/d/${document.nationalID}/preview`}
                              width="100%"
                              height="500"
                              allow="autoplay"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-light">No shareholders available</p>
                    )}
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="beneficialOwners" id="beneficialOwners">
                <div className="card">
                  <div className="card-body">
                    {beneficial.length > 0 ? (
                      <div>
                        {beneficial.map((owner, index) => (
                          <div key={index}>
                            <h4 className="text-primary mb-2 mt-4">Name: {owner.name}</h4>
                            <h4 className="text-light mb-2 mt-4">Percentage Owned: {owner.percent}%</h4>
                            <h4 className="text-light mb-2 mt-4">Nationality: {owner.nationality}</h4>
                            <h4 className="text-light mb-2 mt-4">Address: {owner.address}</h4>
                            <iframe
                              title={owner.name}
                              src={`https://drive.google.com/file/d/${owner.nationalID}/preview`}
                              width="100%"
                              height="500"
                              allow="autoplay"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-light">No Beneficial Owners available</p>
                    )}
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      )}
    </div>
  );
};

export default Kyc;
