import sqlite3

def add_sample_dataset():
    conn = sqlite3.connect('data_catalog.db')
    cur = conn.cursor()
    # Seed providers
    providers = [
        ("Apollo Hospital", "Hospital", "Bengaluru"),
        ("Fortis Healthcare", "Hospital", "Delhi"),
        ("IISc Research", "Research", "Bengaluru"),
        ("AIIMS", "Hospital", "New Delhi"),
        ("NIMHANS", "Hospital", "Bengaluru"),
        ("Tata Memorial", "Hospital", "Mumbai"),
        ("Max Healthcare", "Hospital", "Delhi"),
        ("Manipal Hospitals", "Hospital", "Bengaluru"),
        ("CSIR Labs", "Research", "Hyderabad"),
    ]
    cur.executemany('''
        INSERT OR IGNORE INTO providers (name, type, location) VALUES (?, ?, ?)
    ''', providers)
    datasets = [
        ("Diabetes Patient Cohort", "Anonymized FHIR dataset for diabetes research.", "Apollo Hospital", 200.0, "Diabetes", "FHIR"),
        ("Cardiology Cases", "Heart disease FHIR data for clinical trials.", "Fortis Healthcare", 350.0, "Cardiology", "FHIR"),
        ("Oncology Imaging", "Anonymized oncology imaging FHIR bundle.", "Tata Memorial", 500.0, "Oncology", "FHIR"),
        ("Neuro Study", "Neurological disorders registry.", "NIMHANS", 420.0, "Neurology", "FHIR"),
        ("Pediatrics Vaccination", "Pediatric vaccination records.", "AIIMS", 180.0, "Pediatrics", "FHIR"),
        ("Respiratory Cohort", "COPD & asthma anonymized data.", "Max Healthcare", 260.0, "Respiratory", "FHIR"),
        ("Orthopedics Imaging", "MSK imaging with structured metadata.", "Manipal Hospitals", 310.0, "Orthopedics", "FHIR"),
        ("Virology Trials", "CSIR lab trial datasets.", "CSIR Labs", 290.0, "Virology", "FHIR"),
    ]
    cur.executemany('''
        INSERT INTO datasets (title, description, provider, price, category, format)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', datasets)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_sample_dataset()
