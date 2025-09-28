# FlashTalk

A modern real-time messaging application built with .NET 8 Web API and React with TypeScript. FlashTalk provides instant messaging capabilities with user authentication, file sharing, and a clean, responsive user interface.

## 🚀 Features

- **Real-time Messaging**: Send and receive messages instantly
- **User Authentication**: Secure JWT-based authentication system
- **User Registration & Login**: Complete user management system
- **File Sharing**: Upload and download documents in conversations
- **User Search**: Find and connect with other users
- **Responsive UI**: Modern Material-UI based interface
- **Clean Architecture**: Following Clean Architecture principles with separation of concerns

## 🏗️ Architecture

This project follows Clean Architecture principles with the following layers:

- **FlashTalk.Domain**: Core business entities and interfaces
- **FlashTalk.Application**: Use cases and business logic
- **FlashTalk.Infrastructure**: Data access and external services
- **FlashTalk.Presentation**: Web API controllers and configuration
- **FlashTalk.UI**: React frontend application

## 🛠️ Tech Stack

### Backend

- **.NET 8** - Web API framework
- **Entity Framework Core** - ORM for data access
- **SQL Server** - Database
- **JWT Authentication** - Secure token-based authentication
- **Swagger/OpenAPI** - API documentation

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Vite** - Build tool and development server

### DevOps

- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Nginx** - Web server for frontend

## 📋 Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- Docker and Docker Compose
- SQL Server (or use Docker container)

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/gustavocaldassouza/FlashTalk
   cd FlashTalk
   ```

2. **Build and run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:5000>
   - Swagger UI: <http://localhost:5000/swagger>

### Option 2: Local Development

#### Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd FlashTalk.Presentation
   ```

2. **Restore dependencies**

   ```bash
   dotnet restore
   ```

3. **Update connection string** in `appsettings.json` to point to your SQL Server instance

4. **Run the application**

   ```bash
   dotnet run
   ```

#### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd FlashTalk.UI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:5000>

## 🐳 Docker Deployment

### Build Images

```bash
# Build backend image
docker build -t flashtalk-api .

# Build frontend image
docker build -t flashtalk-ui ./FlashTalk.UI
```

### Run with Docker Compose

```bash
docker-compose up -d
```

## ☸️ Kubernetes Deployment

Deploy to Kubernetes using the provided configuration:

```bash
kubectl apply -f Deployment.yml
```

This will deploy:

- 3 replicas of the backend API
- 3 replicas of the frontend UI
- 1 SQL Server instance
- Load balancer services

## 📚 API Documentation

Once the backend is running, you can access the Swagger UI at:

- Development: <http://localhost:5000/swagger>
- Production: <http://your-domain/swagger>

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `GET /api/users/search` - Search users
- `POST /api/files/upload` - Upload file
- `GET /api/files/{id}` - Download file

## 🔧 Configuration

### Backend Configuration

Update `appsettings.json` with your settings:

```json
{
  "ConnectionStrings": {
    "FlashTalkDb": "your-connection-string"
  },
  "Jwt": {
    "Issuer": "your-issuer",
    "Key": "your-secret-key"
  }
}
```

### Frontend Configuration

Update API endpoints in `src/services/` if needed for different environments.

## 🧪 Testing

### Backend Testing

```bash
cd FlashTalk.Presentation
dotnet test
```

### Frontend Testing

```bash
cd FlashTalk.UI
npm test
```

## 📁 Project Structure

```
FlashTalk/
├── FlashTalk.Domain/          # Core business entities
├── FlashTalk.Application/     # Use cases and business logic
├── FlashTalk.Infrastructure/  # Data access layer
├── FlashTalk.Presentation/    # Web API layer
├── FlashTalk.UI/             # React frontend
├── Dockerfile                # Backend container config
├── Deployment.yml            # Kubernetes deployment
└── README.md                # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure SQL Server is running
   - Check connection string in `appsettings.json`
   - Verify database exists

2. **CORS Issues**
   - Check CORS configuration in `Program.cs`
   - Ensure frontend URL is allowed

3. **JWT Token Issues**
   - Verify JWT secret key configuration
   - Check token expiration settings

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Happy Messaging! 💬**
