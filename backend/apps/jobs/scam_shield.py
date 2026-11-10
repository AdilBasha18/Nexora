import re

SCAM_INDICATORS = [
    (r'\b(registration fee|application fee|processing fee|security deposit|pay for training)\b', 'Mentions upfront application or training fees.'),
    (r'\b(crypto|bitcoin|usdt|ethereum|wire transfer|western union|gift card)\b', 'Requests payment via cryptocurrency, gift cards, or wire transfers.'),
    (r'\b(telegram only|whatsapp only|contact me on telegram|chat on whatsapp)\b', 'Only allows unofficial messaging channels without legitimate company contact.'),
    (r'\b(earn \$?\d{4,}\s*(daily|per day)|guaranteed \$?\d{4,}/week with no experience)\b', 'Unrealistic earnings promised for entry-level work with zero experience required.'),
    (r'\b(send your bank account details|send ssn to apply|bank login)\b', 'Requests sensitive banking credentials or identification before hiring.')
]

def evaluate_job_scam_risk(title: str, description: str, responsibilities: str) -> tuple[bool, str]:
    """
    Evaluates job listing for scam risk indicators.
    Returns (has_warning, reason).
    """
    text = f"{title} {description} {responsibilities}".lower()
    flags = []

    for pattern, reason in SCAM_INDICATORS:
        if re.search(pattern, text, re.IGNORECASE):
            flags.append(reason)

    if flags:
        return True, "Job Scam Shield Notice: " + " ".join(flags)
    return False, ""

