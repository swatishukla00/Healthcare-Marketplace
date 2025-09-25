def patient_to_fhir(patient):
    return {
        "resourceType": "Patient",
        "id": str(patient["patient_id"]),
        "name": [{"family": patient["last_name"], "given": [patient["first_name"]]}],
        "gender": patient.get("gender"),
        "birthDate": patient.get("birth_date")
    }
