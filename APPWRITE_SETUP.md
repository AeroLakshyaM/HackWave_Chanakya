# Appwrite Database Setup for User Profiles

## Collection Setup

You need to create a collection called `user_profiles` in your Appwrite database with the following structure:

### Collection ID: `user_profiles`
### Database ID: `68a80162002e7f4da4d7`

## Attributes

### Required Attributes:

1. **userId** (String, Required)
   - Type: String
   - Required: Yes
   - Size: 36 characters

2. **userEmail** (Email, Required)
   - Type: Email
   - Required: Yes
   - Automatically validates email format

3. **userName** (String, Required)
   - Type: String
   - Required: Yes
   - Size: 255 characters

4. **userType** (String, Required)
   - Type: String
   - Required: Yes
   - Size: 50 characters
   - Allowed values: ["startup", "established"]

5. **websiteLink** (String, Optional)
   - Type: String
   - Required: No
   - Size: 500 characters
   - This stores the user's website or LinkedIn profile link
   - Automatically formatted with https:// if not present

6. **startupProfile** (Boolean, Required)
   - Type: Boolean
   - Required: Yes
   - Value: true for startup users, false for established company users

7. **establlishedProfile** (Boolean, Required)
   - Type: Boolean
   - Required: Yes
   - Value: true for established company users, false for startup users
   - **Note**: Database attribute has a typo - "establlishedProfile" instead of "establishedProfile"

8. **rawProfileData** (String, Required)
   - Type: String
   - Required: Yes
   - Size: 15000 characters
   - This will store the JSON string of all user answers as backup

9. **createdAt** (String, Required)
   - Type: String
   - Required: Yes
   - Size: 255 characters

10. **updatedAt** (String, Required)
   - Type: String
   - Required: Yes
   - Size: 255 characters

## Permissions

### Read Permissions:
- Users can read their own profile: `user:{{user.$id}}`

### Write Permissions:
- Users can create their own profile: `user:{{user.$id}}`
- Users can update their own profile: `user:{{user.$id}}`

### Delete Permissions:
- Users can delete their own profile: `user:{{user.$id}}`

## Indexes

Create the following indexes for better performance:

1. **userId_index**
   - Attribute: userId
   - Type: Key
   - Orders: ASC

2. **userEmail_index**
   - Attribute: userEmail
   - Type: Key
   - Orders: ASC

3. **userType_index**
   - Attribute: userType
   - Type: Key
   - Orders: ASC

## How to Create in Appwrite Console:

1. Go to your Appwrite Console
2. Navigate to Databases → Your Database (ID: 68a80162002e7f4da4d7)
3. Click "Add Collection"
4. Set Collection ID: `user_profiles`
5. Add all the attributes listed above
6. Set the permissions as specified
7. Create the indexes
8. Save the collection

## Data Flow:

1. User signs up/logs in via Auth.jsx
2. User is redirected to StartupOrNotPage
3. User selects startup or established company
4. User answers profile questions
5. Data is saved to `user_profiles` collection
6. User is redirected to `/dashboard` page

## Example Profile Data Structure:

### Startup User Example:
```json
{
  "userId": "68a9cd55bb1e61008383",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "userType": "startup",
  "websiteLink": "https://innovateinc.com",
  "startupProfile": true,
  "establlishedProfile": false,
  "rawProfileData": "{\"startupName\":\"Innovate Inc.\",\"productIdea\":\"AI-powered productivity tool...\"}",
  "createdAt": "2025-01-24T10:00:00.000Z",
  "updatedAt": "2025-01-24T10:00:00.000Z"
}
```

### Established Company User Example:
```json
{
  "userId": "68a9cd55bb1e61008384",
  "userEmail": "manager@company.com",
  "userName": "Jane Smith",
  "userType": "established",
  "websiteLink": "https://globaltechsolutions.com",
  "startupProfile": false,
  "establlishedProfile": true,
  "rawProfileData": "{\"companyName\":\"Global Tech Solutions\",\"yourRole\":\"Product Manager\"...}",
  "createdAt": "2025-01-24T10:00:00.000Z",
  "updatedAt": "2025-01-24T10:00:00.000Z"
}
```

## API Usage Examples:

### Creating a User Profile:
```javascript
import { account, database } from '../config/Appwrite'
import { ID } from 'appwrite'

const createUserProfile = async (userData, answers, userType) => {
  try {
    const now = new Date().toISOString()
    
    const profileData = {
      userId: userData.$id,
      userEmail: userData.email,
      userName: userData.name,
      userType: userType,
      websiteLink: answers.websiteLink || '',
      rawProfileData: JSON.stringify(answers),
      createdAt: now,
      updatedAt: now
    }

    if (userType === 'startup') {
      profileData.startupProfile = true
      profileData.establlishedProfile = false
    } else {
      profileData.startupProfile = false
      profileData.establlishedProfile = true
    }

    const response = await database.createDocument(
      '68a80162002e7f4da4d7',
      'user_profiles',
      ID.unique(),
      profileData
    )

    return response
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}
```

### Reading a User Profile:
```javascript
const getUserProfile = async (userId) => {
  try {
    const response = await database.listDocuments(
      '68a80162002e7f4da4d7',
      'user_profiles',
      [
        database.queries.equal('userId', userId)
      ]
    )
    
    return response.documents[0] || null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}
```

### Updating a User Profile:
```javascript
const updateUserProfile = async (documentId, updatedData) => {
  try {
    const now = new Date().toISOString()
    updatedData.updatedAt = now
    
    const response = await database.updateDocument(
      '68a80162002e7f4da4d7',
      'user_profiles',
      documentId,
      updatedData
    )
    
    return response
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}
```

## Troubleshooting:

### Common Issues:

1. **Permission Denied Error**
   - Make sure the user is authenticated
   - Check that permissions are set correctly
   - Verify the user ID matches the document's userId

2. **Attribute Validation Error**
   - Check that all required fields are provided
   - Verify data types match the attribute definitions
   - Ensure string lengths are within limits

3. **Collection Not Found Error**
   - Verify the collection ID is correct
   - Check that the collection exists in the database
   - Ensure the database ID is correct

### Debug Steps:

1. **Check Console Logs**
   - Look for error messages in browser console
   - Check Appwrite console for server-side errors

2. **Verify Data Structure**
   - Log the data being sent to Appwrite
   - Compare with the expected structure

3. **Test with Sample Data**
   - Try creating a document with minimal required fields
   - Gradually add more fields to identify the issue

## Security Considerations:

1. **Data Validation**
   - Always validate user input before saving
   - Sanitize data to prevent injection attacks
   - Check data types and lengths

2. **Access Control**
   - Users should only access their own profiles
   - Implement proper authentication checks
   - Use Appwrite's built-in security features

3. **Data Privacy**
   - Store sensitive data securely
   - Implement data retention policies
   - Follow GDPR and other privacy regulations

## Performance Optimization:

1. **Indexing**
   - Create indexes on frequently queried fields
   - Use compound indexes for complex queries
   - Monitor query performance

2. **Data Structure**
   - Keep document sizes reasonable
   - Use appropriate data types
   - Consider data normalization

3. **Caching**
   - Cache frequently accessed profiles
   - Implement client-side caching
   - Use Appwrite's caching features

---

**Note**: This setup provides a robust foundation for storing user profile data. Make sure to test thoroughly in a development environment before deploying to production.
