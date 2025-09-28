# Jenkins Pipeline Configuration for FlashTalk

This directory contains Jenkins configuration files for the FlashTalk project.

## Pipeline Overview

The Jenkins pipeline for FlashTalk includes the following stages:

1. **Checkout** - Clone the repository
2. **Parallel Build & Test** - Build and test both backend and frontend simultaneously
3. **Security Scan** - Vulnerability scanning for both .NET and npm packages
4. **Push Images** - Push Docker images to registry (main/develop branches only)
5. **Deploy to Staging** - Automatic deployment to staging (develop branch)
6. **Deploy to Production** - Manual approval deployment to production (main branch)

## Prerequisites

### Jenkins Configuration

1. **Required Plugins:**
   - Docker Pipeline
   - Kubernetes CLI
   - NodeJS Plugin
   - .NET SDK Plugin
   - Pipeline Stage View
   - Blue Ocean (recommended)

2. **Global Tools Configuration:**
   - Configure .NET 8 SDK as 'dotnet-8'
   - Configure Node.js 18+ as 'nodejs-18'

3. **Credentials Configuration:**
   - `docker-registry-url`: URL of your Docker registry
   - `docker-registry-credentials`: Docker registry username/password
   - `kubeconfig`: Kubernetes cluster configuration (if using K8s deployment)

### Environment Setup

1. **Docker Registry:**
   ```bash
   # Example for Docker Hub
   docker login
   ```

2. **Kubernetes Access:**
   ```bash
   # Ensure kubectl is configured to access your cluster
   kubectl config view
   ```

## Pipeline Triggers

- **Pull Requests**: Build and test only
- **Develop Branch**: Build, test, security scan, and deploy to staging
- **Main Branch**: Build, test, security scan, and deploy to production (with manual approval)

## Customization

### Modifying Image Names
Update the environment variables in the Jenkinsfile:
```groovy
BACKEND_IMAGE = "your-registry/flashtalk-api:${env.BUILD_NUMBER}"
FRONTEND_IMAGE = "your-registry/flashtalk-ui:${env.BUILD_NUMBER}"
```

### Adding Test Reports
The pipeline includes test result publishing for .NET projects. If you add test projects:
1. Name them with `.Tests` suffix (e.g., `FlashTalk.Application.Tests`)
2. Ensure they output `.trx` files

### Environment-Specific Configurations
Create separate deployment files for different environments:
- `deployment-staging.yml`
- `deployment-production.yml`

## Monitoring and Notifications

The pipeline includes:
- Pull request comments for build status
- Test result publishing
- Build artifact archiving
- Automatic cleanup of Docker images

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check .NET SDK version compatibility
   - Ensure all NuGet packages are available
   - Verify Node.js version compatibility

2. **Docker Build Issues:**
   - Ensure Docker daemon is running on Jenkins agents
   - Check Dockerfile syntax and paths
   - Verify base image availability

3. **Deployment Issues:**
   - Ensure kubectl is configured correctly
   - Check Kubernetes cluster connectivity
   - Verify namespace existence and permissions

### Debug Commands

```bash
# Check .NET version
dotnet --version

# Check Node.js version
node --version
npm --version

# Check Docker
docker --version
docker images

# Check Kubernetes connectivity
kubectl cluster-info
kubectl get nodes
```