from diffprivlib.mechanisms import Laplace

def add_laplace_noise(value, epsilon=1.0, sensitivity=1.0):
    mech = Laplace(epsilon=epsilon, sensitivity=sensitivity)
    return int(mech.randomise(value))

def differential_privacy_advanced(data, epsilon=1.0):
    numeric_fields = ['age', 'income', 'weight', 'height']
    for record in data:
        for field in numeric_fields:
            if field in record:
                record[field] = add_laplace_noise(record[field], epsilon)
    return data

def generalize_age(age):
    if age < 20:
        return "<20"
    elif age < 40:
        return "20-39"
    elif age < 60:
        return "40-59"
    else:
        return "60+"

def generalize_zip(zip_code):
    return zip_code[:3] + "XX"

def k_anonymity_advanced(data, k=3):
    for record in data:
        record['age'] = generalize_age(record.get('age', 0))
        record['zip_code'] = generalize_zip(record.get('zip_code', '00000'))
    return data
