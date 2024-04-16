export const RootMenu = [
    {   
        title:'Overview',
        iconStyle: <i className="flaticon-layout"></i>,
        to: 'overview',
    },

    // Organization
    {
        title: 'Knowledge Base',
        iconStyle: <i className="flaticon-monitor"></i>,
        to: 'knowledge' 
    },

    // Locations
    {
        title: 'Locations',
        class: 'mm-collapse',
        iconStyle: <i className="flaticon-location"></i>,
        content: [
            {
                title: 'Mine Sites',
                to: '/mine-sites',
            },
            {
                title: 'Miners',
                to: '/miners',
            },
            {
                title: 'Villages',
                to: '/villages',
            },
        ]
    },

    {   
        title:'Suppliers',
        iconStyle: <i className="flaticon-invoice"></i>,
        to: 'suppliers',
    },

    // Shareholders
    // {
    //     title: 'Shareholders',
    //     class: 'mm-collapse',
    //     iconStyle: <i className="flaticon-content"></i>,
    //     content: [
    //         {
    //             title: 'Suppliers',
    //             to: '/suppliers',
    //         },
    //         {
    //             title: 'Miners',
    //             to: '/miners',
    //         },
    //     ]
    // },

    // Events
    {
        title: 'Events',
        class: 'mm-collapse',
        iconStyle: <i className="flaticon-381-list"></i>,
        content: [
            {
                title: 'Incidents',
                to: 'incidents',
            },
            {
                title: 'Assessments',
                to: '/assessments',
            },
            {
                title: 'Exports',
                to: '/exports',
            },
        ]
    },

    // Reporting
    // {
    //     title: 'Reporting',
    //     class: 'mm-collapse',
    //     iconStyle: <i className="flaticon-business-report"></i>,
    //     content: [
    //         {
    //             title: 'Auto Reports',
    //             to: 'report',
    //         },
    //         {
    //             title: 'Custom/Manual',
    //             to: 'manual-report',
    //         },
    //     ]
    // },
    {
        title:'Reporting',
        to: 'reports',
        update:"New",
        iconStyle : <i className="flaticon-business-report" />,

    },

    // Users
    {
        title: 'Settings',
        class: 'mm-collapse',
        iconStyle: <i className="flaticon-settings-1"></i>,
        content: [
            {
                title: 'Manage Users',
                to: '/users',
            }
        ]
    }    
]

export const RegulatorMenu = [
    {   
        title:'Overview',
        iconStyle: <i className="flaticon-layout"></i>,
        to: 'overview',
    },

    // Organization
    {
        title: 'DD Systems',
        class: 'mm-collapse',
        iconStyle: <i className="flaticon-monitor"></i>,
        content: [
            {
                title: 'KYC Form',
                to: 'dd-systems/kyc',
            },
            {
                title: 'Platform Grievance Mechanisms',
                to: 'dd-systems/grievance',
            },
            {
                title: 'Traceability Guide for 3TG Operators',
                to: 'dd-systems/traceability-guide',
            },
            {
                title: 'Risk Management Plan',
                to: 'dd-systems/risk-management',
            },
            {
                title: 'Shipment Conformance Notice',
                to: 'dd-systems/shipment-conformance',
            },
            {
                title: 'Supplier Code of Conduct',
                to: 'dd-systems/code-of-conduct',
            },
            {
                title: 'Operator Onboarding',
                to: 'dd-systems/operator-onboarding',
            },
            {
                title: 'Know Your Counterpart Form',
                to: 'dd-systems/asm',
            },
            {
                title: 'Trace Due Diligence Programme Introduction',
                to: 'dd-systems/trace-due-diligence',
            },
            {
                title: 'Rwanda - Internal Supplement',
                to: 'dd-systems/internal-supplement-rw',
            }
        ]
    },

    {   
        title:'Compliance',
        iconStyle: <i className="flaticon-contract"></i>,
        to: 'compliance',
    },

    // Shareholders
    {
        title: 'Shareholders',
        class: 'mm-collapse',
        iconStyle: <i className="flaticon-content"></i>,
        content: [
            {
                title: 'Suppliers',
                to: '/suppliers',
            },
            {
                title: 'Mines',
                to: '/mines',
            },
        ]
    },

    // Locations
    {
        title: 'Locations',
        class: 'mm-collapse',
        iconStyle: <i className="flaticon-location"></i>,
        content: [
            {
                title: 'All',
                to: '/locations',
            },
            {
                title: 'Mine Sites',
                to: '/mine-sites',
            },
            {
                title: 'Villages',
                to: '/villages',
            },
        ]
    },

    // Events
    {
        title: 'Events',
        class: 'mm-collapse',
        iconStyle: <i className="flaticon-381-list"></i>,
        content: [
            {
                title: 'Incidents',
                to: 'incidents',
            },
            {
                title: 'Assessments',
                to: '/assessments',
            },
        ]
    },

    // Reporting
    {
        title:'Reporting',
        to: 'reports',
        update:"New",
        iconStyle : <i className="flaticon-business-report" />,

    },  
]

export const BMenu = [
    {   
        title:'Overview',
        iconStyle: <i className="flaticon-layout"></i>,
        to: 'overview',
    },

    {   
        title:'Exports',
        iconStyle: <i className="flaticon-381-list"></i>,
        to: 'exports',
    },

    
    {   
        title:'Mines',
        iconStyle: <i className="flaticon-location"></i>,
        to: 'mines',
    },

    {
        title: 'Knowledge Base',
        iconStyle: <i className="flaticon-monitor"></i>,
        to: 'knowledge' 
    }
]

export const IMenu = [
    {   
        title:'Overview',
        iconStyle: <i className="flaticon-layout"></i>,
        to: 'overview',
    },

    {   
        title:'Exports',
        iconStyle: <i className="flaticon-381-list"></i>,
        to: 'exports',
    },

    
    {   
        title:'Mines',
        iconStyle: <i className="flaticon-location"></i>,
        to: 'mines',
    },

    {
        title: 'Knowledge Base',
        iconStyle: <i className="flaticon-monitor"></i>,
        to: 'knowledge' 
    },

    {
        title:'Reporting',
        to: 'reports',
        update:"New",
        iconStyle : <i className="flaticon-business-report" />,
        content: [
            // {
            //     title: 'Today\'s Report',
            //     to: '/reports/today',
            // },
            {
                title: 'Total Stock Delivery',
                to: '/reports/daily',
            },
            {
                title: 'In-Stock Country Balance',
                to: '/reports/mtd',
            },
            {
                title: 'Total Purchase',
                to: '/reports/deliveries',
            },
        ]

    }
]