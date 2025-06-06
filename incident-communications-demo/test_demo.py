#!/usr/bin/env python3
"""
Simple test script for the Incident Communications Demo
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_draft_generation():
    """Test draft generation endpoint"""
    print("\n🤖 Testing draft generation...")
    try:
        payload = {"incident_id": "INC-123"}
        response = requests.post(f"{BASE_URL}/api/draft", json=payload)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Draft length: {len(data.get('draft', ''))}")
            print(f"   Latency: {data.get('latency_ms', 0)}ms")
            print(f"   Leaks detected: {len(data.get('leaks', []))}")
            if data.get('leaks'):
                print(f"   Leaks: {data['leaks']}")
            return data
        else:
            print(f"   ❌ Error: {response.text}")
            return None
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def test_redactor():
    """Test local redaction endpoint"""
    print("\n🛡️ Testing redactor...")
    try:
        # Test text with sensitive data
        test_text = "Contact john.doe@abnormal.com at 555-123-4567 or check db-server.internal.abnormal.com"
        payload = {"text": test_text}
        response = requests.post(f"{BASE_URL}/api/draft/redact_local", json=payload)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Original: {test_text}")
            print(f"   Redacted: {data.get('redacted_text', '')}")
            print(f"   Leaks found: {data.get('leaks', [])}")
            return True
        else:
            print(f"   ❌ Error: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_status_endpoints():
    """Test status endpoints"""
    print("\n📊 Testing status endpoints...")
    try:
        # Get current status
        response = requests.get(f"{BASE_URL}/api/status")
        print(f"   Get status: {response.status_code}")
        initial_count = len(response.json()) if response.status_code == 200 else 0
        print(f"   Initial updates: {initial_count}")
        
        # Publish a test update (without leaks)
        test_draft = "We are currently investigating reports of slow response times. Updates to follow."
        payload = {"draft": test_draft}
        response = requests.post(f"{BASE_URL}/api/publish", json=payload)
        print(f"   Publish status: {response.status_code}")
        
        if response.status_code == 200:
            # Check if it was added
            response = requests.get(f"{BASE_URL}/api/status")
            final_count = len(response.json()) if response.status_code == 200 else 0
            print(f"   Final updates: {final_count}")
            return final_count > initial_count
        else:
            print(f"   ❌ Publish error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Incident Communications Demo Tests")
    print("=" * 50)
    
    # Test health first
    if not test_health():
        print("❌ Backend is not running. Start with: python backend/app.py")
        return
    
    # Run tests
    tests = [
        test_redactor,
        test_draft_generation,
        test_status_endpoints
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n✅ Tests completed: {passed}/{len(tests) + 1} passed")
    
    if passed == len(tests):
        print("\n🎉 All tests passed! The demo is ready to use.")
        print("📝 Try these commands in the frontend:")
        print("   /incident new INC-123")
        print("   /incident new INC-456") 
        print("   /incident new INC-789")
    else:
        print("\n⚠️  Some tests failed. Check the backend logs.")

if __name__ == "__main__":
    main() 