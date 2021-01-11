export const addressDefault = {
    country: "",
    region: "",
    city: "",
    sub_city: "",
    wereda: "",
    house_no: "",
    address_line_1: "",
    address_line_2: "",
    state: "",
    zip_code: "",
    insurance_carrier: "",
    insured_name: "",
    group_number: "",
    policy_number: ""
}

export const locationDefault = {
    lat: 0,
    lng: 0
}

export const bioMetricsDefault = {
    gender: '',
    dob: '',
    height: 0,
    unit: '',
    weight: 0,
}

export const familyHistoryDefault = {
    heart_disease: {
        isbool: false,
        member_names: []
    },
    cancer_disease: {
        isbool: false,
        member_names: []
    },
    diabetes_disease: {
        isbool: false,
        member_names: []
    },
    high_blod_presure_disease: {
        isbool: false,
        member_names: []
    },
    asthma_disease: {
        isbool: false,
        member_names: []
    }
}

export const personalHistoryDefault = {
    marital_status: '',
    children: {
        isbool: false,
        count: 0
    },
    smoke: {
        isbool: false,
        count: 0
    },
    drink: {
        isbool: false,
        count: 0
    },
    drugs: {
        isbool: false,
        type_of_drugs: []
    }
}

export const medicalHstoryDefault = {
    how_long_ago_months: 0,
    heart_disease: false,
    cancer_disease: false,
    diabetes_disease: false,
    copd_disease: false,
    kideny_disease: false,
    high_blod_presure_disease: false,
    asthma_disease: false,
    hospitalization: false
}

export const enrollmentInfoDefault = {
    years_of_experience: 0,
    speciality: [],
    sub_speciality: "",
    ssn_number: "",
    dl_number: "",
    dl_issuing_country: "",
    dl_issuing_state: "",
    us_dea_license_number: "",
    languages_spoken: [],
    countries_license_to_practice: [],
    state_license_to_practice: [],
    additional_info: "",
    under_grad: "",
    post_grad: ""
}

export const documentsDefault = {
    undergraduate_degree_doc: "",
    medical_school_degree_doc: "",
    residency_doc: "",
    fellowship_doc: "",
    state_license_doc: "",
    national_license_doc: "",
    dea_certification: "",
    digital_signature_doc: ""
}

export const doctorNotesNewDefault = {
    subjective: 0,
    objective: "",
    general_appearance: "",
    HEENT: "",
    neck: "",
    cardiac: "",
    abdomen: "",
    musculoskeletal: "",
    extremities: "",
    lungs: "",
    dermatologic: "",
    neurological: "",
    psychiatry: "",
    assessment: "",
    plan: ""
}

export const progressNoteDefault = {
    visit_type: 0,
    constitutional: "",
    ENT_mouth: "",
    cardiovascular: "",
    respiratory: "",
    gastrointestinal: "",
    genitourinary: "",
    mosculoskeletan: "",
    skin: "",
    neuro: "",
    psych: "",
    heme_lymph: "",
    endocrine: "",
    assessment: "",
    plan: ""
}

export const historyAndPhysicalDefault = {
    chief_complaint: 0,
    history_of_present_illness: "",
    allergy: "",
    past_surgical_history: "",
    hospitalization_history: "",
    social_history: "",
    family_history: "",
    medication: "",
    vitals: [ {
        "types":  "",
        "values":  ""
    }]
}