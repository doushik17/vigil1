import random
import math
import time


class PatientMonitor:
    """
    Simulates live patient vitals.
    """

    def __init__(self):
        self.start_time = time.time()

    def get_live_vitals(self):
        t = time.time() - self.start_time

        heart_rate = random.randint(72, 86)

        spo2 = round(random.uniform(97.0, 99.0), 1)

        systolic = random.randint(115, 125)
        diastolic = random.randint(70, 82)

        respiratory_rate = random.randint(14, 18)

        temperature = round(random.uniform(36.6, 37.2), 1)

        ecg = []

        for i in range(200):
            x = (i / 20) + t
            y = math.sin(x * 5) * 0.15

            # Create QRS spike
            if i % 40 == 20:
                y += 1.2

            ecg.append(round(y, 3))

        return {
            "heart_rate": heart_rate,
            "spo2": spo2,
            "blood_pressure": f"{systolic}/{diastolic}",
            "respiratory_rate": respiratory_rate,
            "temperature": temperature,
            "ecg": ecg
        }


monitor = PatientMonitor()