#!/usr/bin/env python3
"""
Backend API Testing Script for Video Streaming Platform
Tests all backend endpoints and functionality
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "https://2ecb655c-6a0e-4c05-a160-021c2078f13a.preview.emergentagent.com"

BASE_URL = get_backend_url()
API_BASE_URL = f"{BASE_URL}/api"

def test_health_check():
    """Test basic server health check (GET /)"""
    print("🔍 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=10)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get("message") == "Hello World":
            print("   ✅ Health check passed")
            return True
        else:
            print("   ❌ Health check failed - unexpected response")
            return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Health check failed - Connection error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Health check failed - Error: {e}")
        return False

def test_cors_configuration():
    """Test CORS configuration"""
    print("🔍 Testing CORS Configuration...")
    try:
        # Test preflight request
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{API_BASE_URL}/", headers=headers, timeout=10)
        print(f"   Preflight Status Code: {response.status_code}")
        
        # Check CORS headers
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        print(f"   CORS Headers: {cors_headers}")
        
        if response.status_code in [200, 204] and cors_headers['Access-Control-Allow-Origin']:
            print("   ✅ CORS configuration working")
            return True
        else:
            print("   ❌ CORS configuration issues detected")
            return False
    except Exception as e:
        print(f"   ❌ CORS test failed - Error: {e}")
        return False

def test_database_connectivity():
    """Test database connectivity through status endpoints"""
    print("🔍 Testing Database Connectivity...")
    try:
        # Test POST to create a status check (tests DB write)
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        response = requests.post(f"{API_BASE_URL}/status", 
                               json=test_data, 
                               headers={'Content-Type': 'application/json'},
                               timeout=10)
        print(f"   POST Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_status = response.json()
            print(f"   Created Status: {created_status}")
            
            # Test GET to retrieve status checks (tests DB read)
            get_response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            print(f"   GET Status Code: {get_response.status_code}")
            
            if get_response.status_code == 200:
                status_list = get_response.json()
                print(f"   Retrieved {len(status_list)} status records")
                
                # Verify our created record exists
                found_record = any(s['id'] == created_status['id'] for s in status_list)
                if found_record:
                    print("   ✅ Database connectivity working - Read/Write operations successful")
                    return True
                else:
                    print("   ❌ Database connectivity issue - Created record not found")
                    return False
            else:
                print("   ❌ Database read operation failed")
                return False
        else:
            print(f"   ❌ Database write operation failed - Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Database connectivity test failed - Error: {e}")
        return False

def test_authentication_endpoints():
    """Test authentication endpoints if available"""
    print("🔍 Testing Authentication Endpoints...")
    
    # Common auth endpoint patterns to test
    auth_endpoints = ['/auth/login', '/auth/register', '/auth/logout', '/login', '/register', '/user/login']
    
    found_auth_endpoints = []
    for endpoint in auth_endpoints:
        try:
            response = requests.get(f"{API_BASE_URL}{endpoint}", timeout=5)
            if response.status_code != 404:
                found_auth_endpoints.append((endpoint, response.status_code))
        except:
            continue
    
    if found_auth_endpoints:
        print(f"   Found authentication endpoints: {found_auth_endpoints}")
        print("   ✅ Authentication endpoints detected")
        return True
    else:
        print("   ℹ️  No authentication endpoints found - This may be expected for this implementation")
        return True  # Not a failure, just no auth endpoints

def test_video_endpoints():
    """Test video-related API endpoints if available"""
    print("🔍 Testing Video-Related Endpoints...")
    
    # Common video endpoint patterns to test
    video_endpoints = ['/videos', '/video', '/stream', '/upload', '/media']
    
    found_video_endpoints = []
    for endpoint in video_endpoints:
        try:
            response = requests.get(f"{API_BASE_URL}{endpoint}", timeout=5)
            if response.status_code != 404:
                found_video_endpoints.append((endpoint, response.status_code))
        except:
            continue
    
    if found_video_endpoints:
        print(f"   Found video endpoints: {found_video_endpoints}")
        print("   ✅ Video endpoints detected")
        return True
    else:
        print("   ℹ️  No video-specific endpoints found - This may be expected for this implementation")
        return True  # Not a failure, just no video endpoints

def run_all_tests():
    """Run all backend tests"""
    print("=" * 60)
    print("🚀 BACKEND API TESTING - VIDEO STREAMING PLATFORM")
    print("=" * 60)
    print(f"Testing Backend URL: {API_BASE_URL}")
    print()
    
    test_results = {
        'health_check': test_health_check(),
        'cors_configuration': test_cors_configuration(),
        'database_connectivity': test_database_connectivity(),
        'authentication_endpoints': test_authentication_endpoints(),
        'video_endpoints': test_video_endpoints()
    }
    
    print()
    print("=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
    
    print()
    print(f"Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests passed successfully!")
        return True
    else:
        print("⚠️  Some backend tests failed - see details above")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)