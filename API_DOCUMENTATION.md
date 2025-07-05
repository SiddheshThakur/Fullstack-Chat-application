# Chat Application - Comprehensive API Documentation

## Table of Contents
1. [Backend APIs](#backend-apis)
2. [Frontend Components](#frontend-components) 
3. [State Management](#state-management)
4. [Utility Functions](#utility-functions)
5. [Data Models](#data-models)
6. [Socket.IO Integration](#socketio-integration)
7. [Authentication & Middleware](#authentication--middleware)

---

## Backend APIs

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`
Creates a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```

**Response (201):**
```json
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": ""
}
```

**Error Responses:**
- `400`: Missing fields, password too short, or email already exists
- `500`: Internal server error

**Example Usage:**
```javascript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
```

#### POST `/api/auth/login`
Authenticates user and returns user data.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "_id": "user_id",
  "fullName": "John Doe", 
  "email": "john@example.com",
  "profilePic": "cloudinary_url"
}
```

**Error Responses:**
- `400`: Invalid credentials
- `500`: Internal server error

#### POST `/api/auth/logout`
Logs out the current user by clearing the JWT cookie.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### PUT `/api/auth/update-profile` 🔒
Updates user profile picture. Requires authentication.

**Request Body:**
```json
{
  "profilePic": "base64_image_data"
}
```

**Response (200):**
```json
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com", 
  "profilePic": "updated_cloudinary_url"
}
```

#### GET `/api/auth/check` 🔒
Verifies authentication status. Requires authentication.

**Response (200):**
```json
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": "cloudinary_url"
}
```

### Message Routes (`/api/messages`)

#### GET `/api/messages/users` 🔒
Retrieves all users except the current user for sidebar display.

**Response (200):**
```json
[
  {
    "_id": "user_id",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "profilePic": "cloudinary_url"
  }
]
```

#### GET `/api/messages/:id` 🔒
Retrieves conversation history between current user and specified user.

**Parameters:**
- `id` (string): User ID to get conversation with

**Response (200):**
```json
[
  {
    "_id": "message_id",
    "senderId": "user_id_1",
    "receiverId": "user_id_2", 
    "text": "Hello!",
    "image": "",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### POST `/api/messages/:id` 🔒
Sends a message to specified user.

**Parameters:**
- `id` (string): Receiver's user ID

**Request Body:**
```json
{
  "text": "Hello there!",
  "image": "base64_image_data" // optional
}
```

**Response (201):**
```json
{
  "_id": "message_id",
  "senderId": "current_user_id",
  "receiverId": "receiver_id",
  "text": "Hello there!",
  "image": "cloudinary_url",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

---

## Frontend Components

### Core Components

#### `App.jsx`
Main application component that handles routing and authentication checking.

**Props:** None

**Features:**
- Route protection based on authentication status
- Theme management integration
- Toast notifications setup
- Authentication state checking on app load

**Usage:**
```jsx
import App from './App';
// Rendered as root component in main.jsx
```

#### `Navbar.jsx`
Navigation header component with authentication controls.

**Props:** None

**Features:**
- Responsive navigation links
- Authentication-based conditional rendering
- Logout functionality
- Links to Settings and Profile pages

**Usage:**
```jsx
import Navbar from './components/Navbar';
// Automatically rendered in App.jsx
```

#### `ChatContainer.jsx`
Main chat interface displaying messages and input.

**Props:** None

**Dependencies:**
- Requires `selectedUser` in chat store
- Uses authentication store for current user data

**Features:**
- Real-time message display
- Message history loading
- Socket.IO integration for live updates
- Auto-scroll to latest messages
- Loading states with skeletons

**Usage:**
```jsx
import ChatContainer from './components/ChatContainer';
// Rendered when a user is selected for chat
```

#### `Sidebar.jsx`
User list sidebar for selecting chat conversations.

**Props:** None

**Features:**
- Online user status indicators
- User search/filtering
- Loading states
- User selection for starting conversations

#### `MessageInput.jsx`
Input component for composing and sending messages.

**Props:** None

**Features:**
- Text message input
- Image attachment support
- Emoji picker (if implemented)
- Send message functionality
- Image preview before sending

### Page Components

#### `HomePage.jsx`
Main chat interface layout combining sidebar and chat container.

**Features:**
- Responsive layout
- Conditional rendering based on selected user
- Integration of Sidebar and ChatContainer

#### `LoginPage.jsx`
User authentication page for existing users.

**Features:**
- Email/password form validation
- Loading states during authentication
- Error handling and display
- Navigation to signup page

#### `SignUpPage.jsx`
User registration page for new accounts.

**Features:**
- Form validation (name, email, password)
- Password confirmation
- Account creation with automatic login
- Navigation to login page

#### `ProfilePage.jsx`
User profile management interface.

**Features:**
- Profile picture upload
- User information display
- Profile picture update functionality
- Image cropping/resizing support

#### `SettingsPage.jsx`
Application settings and theme customization.

**Features:**
- Theme selection (multiple themes available)
- Settings persistence in localStorage
- Theme preview functionality

### Utility Components

#### `NoChatSelected.jsx`
Placeholder component displayed when no chat is selected.

**Props:** None

**Features:**
- Welcoming message
- Instructions for starting a chat
- Responsive design

#### `AuthImagePattern.jsx`
Decorative background pattern for authentication pages.

**Props:** None

**Features:**
- SVG pattern background
- Responsive design
- Authentication page styling

### Skeleton Components

#### `MessageSkeleton.jsx`
Loading placeholder for messages.

**Features:**
- Animated loading placeholders
- Message-like structure
- Multiple skeleton items

#### `SidebarSkeleton.jsx`
Loading placeholder for user sidebar.

**Features:**
- User list loading animation
- Consistent with sidebar layout

---

## State Management

### Authentication Store (`useAuthStore`)
Manages user authentication state and related operations.

**State:**
```javascript
{
  authUser: null,              // Current authenticated user
  isSigningUp: false,          // Signup loading state
  isLoggingIn: false,          // Login loading state  
  isUpdatingProfile: false,    // Profile update loading state
  onlineUsers: [],             // List of online user IDs
  socket: null,                // Socket.IO connection
  isCheckingAuth: true         // Initial auth check loading
}
```

**Actions:**

##### `checkAuth()`
Verifies current authentication status on app load.

**Usage:**
```javascript
const { checkAuth } = useAuthStore();
await checkAuth();
```

##### `signup(data)`
Creates new user account.

**Parameters:**
```javascript
{
  fullName: "John Doe",
  email: "john@example.com", 
  password: "password123"
}
```

**Usage:**
```javascript
const { signup, isSigningUp } = useAuthStore();
await signup(userData);
```

##### `login(data)`
Authenticates existing user.

**Parameters:**
```javascript
{
  email: "john@example.com",
  password: "password123" 
}
```

##### `logout()`
Logs out current user and disconnects socket.

##### `updateProfile(data)`
Updates user profile picture.

**Parameters:**
```javascript
{
  profilePic: "base64_image_data"
}
```

##### `connectSocket()` / `disconnectSocket()`
Manages Socket.IO connection lifecycle.

### Chat Store (`useChatStore`)
Manages chat functionality and message state.

**State:**
```javascript
{
  messages: [],               // Current conversation messages
  users: [],                  // Available users for chat
  selectedUser: null,         // Currently selected chat user
  isUsersLoading: false,      // Users loading state
  isMessagesLoading: false,   // Messages loading state
  pendingMessages: new Set()  // Prevents message duplicates
}
```

**Actions:**

##### `getUsers()`
Fetches available users for sidebar.

**Usage:**
```javascript
const { getUsers, users, isUsersLoading } = useChatStore();
await getUsers();
```

##### `getMessages(userId)`
Retrieves conversation history with specific user.

**Parameters:**
- `userId` (string): User ID to get messages with

##### `sendMessage(receiverId, text, image)`
Sends message to specified user.

**Parameters:**
- `receiverId` (string): Recipient user ID
- `text` (string): Message text content
- `image` (string, optional): Base64 image data

**Usage:**
```javascript
const { sendMessage } = useChatStore();
await sendMessage("user123", "Hello!", null);
```

##### `subscribeToMessages()` / `unsubscribeFromMessages()`
Manages Socket.IO message event listeners.

##### `setSelectedUser(user)`
Sets the currently selected user for chat.

### Theme Store (`useThemeStore`)
Manages application theme persistence.

**State:**
```javascript
{
  theme: "coffee"  // Current theme name
}
```

**Actions:**

##### `setTheme(theme)`
Updates and persists theme selection.

**Usage:**
```javascript
const { setTheme } = useThemeStore();
setTheme("dark");
```

---

## Utility Functions

### Backend Utils (`Backend/src/lib/utils.js`)

#### `generateToken(userId, res)`
Generates JWT token and sets HTTP-only cookie.

**Parameters:**
- `userId` (string): User ID to encode in token
- `res` (Response): Express response object

**Returns:** JWT token string

**Usage:**
```javascript
import { generateToken } from '../lib/utils.js';
const token = generateToken(user._id, res);
```

### Frontend Utils (`Frontend/src/lib/utils.js`)

#### `formatMessageTime(date)`
Formats message timestamp for display.

**Parameters:**
- `date` (string|Date): ISO date string or Date object

**Returns:** Formatted time string (HH:mm format)

**Example:**
```javascript
import { formatMessageTime } from '../lib/utils';
const timeString = formatMessageTime("2024-01-01T12:30:00.000Z");
// Returns: "12:30"
```

### Axios Configuration (`Frontend/src/lib/axios.js`)

#### `axiosInstance`
Pre-configured axios instance for API calls.

**Configuration:**
- Base URL: Development (`http://localhost:5001/api`) or Production (`/api`)
- Credentials: Included for cookie-based authentication

**Usage:**
```javascript
import { axiosInstance } from '../lib/axios';
const response = await axiosInstance.get('/auth/check');
```

---

## Data Models

### User Model
MongoDB schema for user accounts.

**Schema:**
```javascript
{
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String, 
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePic: {
    type: String,
    default: ""
  }
}
```

**Timestamps:** Automatically added (`createdAt`, `updatedAt`)

### Message Model
MongoDB schema for chat messages.

**Schema:**
```javascript
{
  senderId: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: ObjectId, 
    ref: "User",
    required: true
  },
  text: {
    type: String
  },
  image: {
    type: String
  }
}
```

**Timestamps:** Automatically added (`createdAt`, `updatedAt`)

---

## Socket.IO Integration

### Server Setup (`Backend/src/lib/socket.js`)

#### `initializeSocket(httpServer)`
Initializes Socket.IO server with HTTP server instance.

**Parameters:**
- `httpServer`: Express HTTP server instance

**Events Handled:**
- `connection`: User connects
- `disconnect`: User disconnects

**Features:**
- Online user tracking
- Real-time online status broadcasting

#### `getReceiverSocketId(userId)`
Retrieves socket ID for specific user.

**Parameters:**
- `userId` (string): User ID to find socket for

**Returns:** Socket ID string or undefined

### Client Integration (Frontend)

#### Socket Events

**Emitted Events:**
- Connection with `userId` in query parameters

**Listened Events:**
- `getOnlineUsers`: Receives array of online user IDs
- `newMessage`: Receives new message object

**Usage in Components:**
```javascript
// In useAuthStore
const socket = io(BASE_URL, {
  query: { userId: authUser._id }
});

socket.on("newMessage", (message) => {
  // Handle new message
});
```

---

## Authentication & Middleware

### Authentication Middleware (`Backend/src/middlewares/auth.middlewares.js`)

#### `protectRoute(req, res, next)`
Middleware function to protect routes requiring authentication.

**Functionality:**
- Extracts JWT token from cookies
- Verifies token validity
- Fetches user data and attaches to request
- Continues to next middleware if valid

**Usage:**
```javascript
import { protectRoute } from '../middlewares/auth.middlewares.js';
router.get('/protected-route', protectRoute, controller);
```

**Error Responses:**
- `401`: No token provided or invalid token
- `404`: User not found
- `500`: Internal server error

### Security Features

#### JWT Configuration
- **Expiration:** 7 days
- **HTTP Only:** Prevents XSS attacks
- **Secure:** HTTPS only in production
- **SameSite:** Strict CSRF protection

#### Password Security
- **Hashing:** bcryptjs with salt rounds (10)
- **Minimum Length:** 6 characters
- **Validation:** Server-side enforcement

#### CORS Configuration
- **Development:** `http://localhost:5173`
- **Production:** Environment-based origin
- **Credentials:** Enabled for cookie-based auth

---

## Environment Variables

### Backend
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key  
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=development|production
```

### Frontend
```env
VITE_API_URL=http://localhost:5001/api
```

---

## Error Handling

### Backend Error Responses
All endpoints follow consistent error response format:

```json
{
  "message": "Error description"
}
```

### Frontend Error Handling
- Toast notifications for user feedback
- Loading states during async operations
- Graceful fallbacks for network issues
- Form validation and error display

---

## Development Setup

### Prerequisites
- Node.js 16+
- MongoDB 4+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Frontend dependencies  
cd Frontend && npm install

# Backend dependencies
cd Backend && npm install
```

### Running the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Testing
```bash
# Run tests (if implemented)
npm test
```

---

## Deployment

### Build Process
```bash
# Build frontend
cd Frontend && npm run build

# Build process copies frontend dist to backend
cd .. && npm run build
```

### Production Considerations
- Environment variables configuration
- Database connection setup
- SSL/HTTPS configuration
- CORS origin configuration
- File upload limits
- Rate limiting (recommended)

---

This documentation covers all public APIs, functions, and components in the chat application. For additional details on specific implementations, refer to the source code in the respective files.