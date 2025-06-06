"""
Redactor service for detecting and masking sensitive information
"""
import re
from typing import List, Tuple


class Redactor:
    def __init__(self):
        # Email pattern
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        
        # Phone pattern (basic US format)
        self.phone_pattern = re.compile(r'\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b')
        
        # IP address pattern
        self.ip_pattern = re.compile(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b')
        
        # Hostname pattern (more comprehensive)
        self.hostname_pattern = re.compile(r'\b([a-zA-Z0-9\-]+\.){2,}[a-zA-Z]{2,}\b')

    def detect_leaks(self, text: str) -> List[str]:
        """
        Detect potential data leaks in text
        Returns list of detected sensitive information
        """
        leaks = []
        
        # Find emails
        emails = self.email_pattern.findall(text)
        leaks.extend([f"EMAIL: {email}" for email in emails])
        
        # Find phone numbers
        phones = self.phone_pattern.findall(text)
        leaks.extend([f"PHONE: {''.join(phone)}" for phone in phones])
        
        # Find IP addresses
        ips = self.ip_pattern.findall(text)
        leaks.extend([f"IP: {ip}" for ip in ips])
        
        # Find hostnames
        hostnames = self.hostname_pattern.findall(text)
        # Convert tuple matches to strings and filter out obvious false positives
        hostname_strings = [''.join(h) if isinstance(h, tuple) else h for h in hostnames]
        hostname_strings = [h for h in hostname_strings if len(h) > 4 and '.' in h]
        leaks.extend([f"HOSTNAME: {hostname}" for hostname in hostname_strings])
        
        return list(set(leaks))  # Remove duplicates

    def redact_text(self, text: str) -> str:
        """
        Redact sensitive information from text
        """
        # Redact emails
        text = self.email_pattern.sub('<REDACTED_EMAIL>', text)
        
        # Redact phone numbers
        text = self.phone_pattern.sub('<REDACTED_PHONE>', text)
        
        # Redact IP addresses
        text = self.ip_pattern.sub('<REDACTED_IP>', text)
        
        # Redact hostnames
        text = self.hostname_pattern.sub('<REDACTED_HOSTNAME>', text)
        
        return text

    def process_text(self, text: str) -> Tuple[str, List[str]]:
        """
        Process text: detect leaks and return redacted version
        Returns tuple of (redacted_text, leaks_found)
        """
        leaks = self.detect_leaks(text)
        redacted = self.redact_text(text)
        return redacted, leaks 