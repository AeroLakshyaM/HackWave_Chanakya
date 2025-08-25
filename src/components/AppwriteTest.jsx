import React, { useState, useEffect } from 'react';
import { account, database } from '../config/Appwrite';
import { ID, Query } from 'appwrite';

const AppwriteTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test 1: Check if user is authenticated
      const user = await account.get();
      setTestResult(prev => prev + '\n✅ User authenticated: ' + user.email);
      
      // Test 2: Try to list documents from user_profiles collection
      try {
        const documents = await database.listDocuments(
          '68a80162002e7f4da4d7',
          'user_profiles',
          []
        );
        setTestResult(prev => prev + '\n✅ Database connection successful. Found ' + documents.documents.length + ' documents.');
      } catch (dbError) {
        setTestResult(prev => prev + '\n❌ Database error: ' + dbError.message);
      }
      
      // Test 3: Try to create a test document with minimal data
      try {
        const minimalTestDoc = await database.createDocument(
          '68a80162002e7f4da4d7',
          'user_profiles',
          ID.unique(),
          {
            userId: user.$id,
            userEmail: user.email,
            userName: user.name,
            userType: 'startup',
            websiteLink: '',
            startupProfile: true,
            establlishedProfile: false,
            rawProfileData: '{}',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
        setTestResult(prev => prev + '\n✅ Minimal test document created successfully!');
        
        // Clean up: Delete the test document
        await database.deleteDocument(
          '68a80162002e7f4da4d7',
          'user_profiles',
          minimalTestDoc.$id
        );
        setTestResult(prev => prev + '\n✅ Test document cleaned up.');
        
      } catch (createError) {
        setTestResult(prev => prev + '\n❌ Document creation error: ' + createError.message);
        console.error('Full error details:', createError);
        
        // Test 4: Try with different data structure
        try {
          setTestResult(prev => prev + '\n🔄 Trying alternative data structure...');
          const altTestDoc = await database.createDocument(
            '68a80162002e7f4da4d7',
            'user_profiles',
            ID.unique(),
            {
              userId: user.$id,
              userEmail: user.email,
              userName: user.name,
              userType: 'established',
              websiteLink: '',
              startupProfile: false,
              establlishedProfile: true,
              rawProfileData: JSON.stringify({ test: true }),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          );
          setTestResult(prev => prev + '\n✅ Alternative structure worked!');
          
          // Clean up
          await database.deleteDocument(
            '68a80162002e7f4da4d7',
            'user_profiles',
            altTestDoc.$id
          );
          setTestResult(prev => prev + '\n✅ Alternative test cleaned up.');
          
        } catch (altError) {
          setTestResult(prev => prev + '\n❌ Alternative structure also failed: ' + altError.message);
        }
      }
      
    } catch (error) {
      setTestResult(prev => prev + '\n❌ Authentication error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Appwrite Connection Test</h2>
      <button 
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
        {testResult || 'Click "Test Connection" to start...'}
      </pre>
    </div>
  );
};

export default AppwriteTest;
