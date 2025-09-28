pipeline {
    agent any

    environment {
        DOTNET_CLI_TELEMETRY_OPTOUT = 'true'
        DOTNET_SKIP_FIRST_TIME_EXPERIENCE = 'true'
        BACKEND_IMAGE = "flashtalk-api:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "flashtalk-ui:${env.BUILD_NUMBER}"
        REGISTRY = credentials('docker-registry-url') // Configure in Jenkins credentials
        REGISTRY_CREDENTIALS = credentials('docker-registry-credentials') // Configure in Jenkins credentials
    }

    tools {
        // Ensure .NET 8 SDK is available
        dotnet 'dotnet-8'
        // Ensure Node.js is available  
        nodejs 'nodejs-18'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Parallel Build & Test') {
            parallel {
                stage('Backend') {
                    stages {
                        stage('Restore .NET Dependencies') {
                            steps {
                                echo 'Restoring .NET dependencies...'
                                sh 'dotnet restore FlashTalk.sln'
                            }
                        }

                        stage('Build .NET Application') {
                            steps {
                                echo 'Building .NET application...'
                                sh 'dotnet build FlashTalk.sln --configuration Release --no-restore'
                            }
                        }

                        stage('Run .NET Tests') {
                            steps {
                                echo 'Running .NET tests...'
                                sh '''
                                    # Run tests if test projects exist
                                    if find . -name "*.Tests.csproj" -o -name "*Test*.csproj" | grep -q .; then
                                        dotnet test FlashTalk.sln --configuration Release --no-build --verbosity normal --logger trx --results-directory TestResults
                                    else
                                        echo "No test projects found, skipping tests"
                                    fi
                                '''
                            }
                            post {
                                always {
                                    // Publish test results if they exist
                                    script {
                                        if (fileExists('TestResults/*.trx')) {
                                            publishTestResults(
                                                testResultsPattern: 'TestResults/*.trx',
                                                mergeTestResults: true
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        stage('Build Backend Docker Image') {
                            steps {
                                echo 'Building backend Docker image...'
                                script {
                                    def backendImage = docker.build("${BACKEND_IMAGE}", ".")
                                    // Store image for later use
                                    env.BACKEND_IMAGE_ID = backendImage.id
                                }
                            }
                        }
                    }
                }

                stage('Frontend') {
                    stages {
                        stage('Install Node Dependencies') {
                            steps {
                                echo 'Installing Node.js dependencies...'
                                dir('FlashTalk.UI') {
                                    sh 'npm ci'
                                }
                            }
                        }

                        stage('Lint Frontend Code') {
                            steps {
                                echo 'Linting frontend code...'
                                dir('FlashTalk.UI') {
                                    sh 'npm run lint'
                                }
                            }
                        }

                        stage('Build Frontend Application') {
                            steps {
                                echo 'Building frontend application...'
                                dir('FlashTalk.UI') {
                                    sh 'npm run build'
                                }
                            }
                            post {
                                success {
                                    // Archive build artifacts
                                    archiveArtifacts artifacts: 'FlashTalk.UI/dist/**/*', fingerprint: true
                                }
                            }
                        }

                        stage('Build Frontend Docker Image') {
                            steps {
                                echo 'Building frontend Docker image...'
                                script {
                                    def frontendImage = docker.build("${FRONTEND_IMAGE}", "./FlashTalk.UI")
                                    // Store image for later use
                                    env.FRONTEND_IMAGE_ID = frontendImage.id
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Security Scan') {
            parallel {
                stage('Backend Security Scan') {
                    when {
                        anyOf {
                            branch 'main'
                            branch 'develop'
                            changeRequest()
                        }
                    }
                    steps {
                        echo 'Running backend security scan...'
                        sh '''
                            # Check for known vulnerabilities in .NET packages
                            dotnet list package --vulnerable --include-transitive || true
                        '''
                    }
                }

                stage('Frontend Security Scan') {
                    when {
                        anyOf {
                            branch 'main'
                            branch 'develop'
                            changeRequest()
                        }
                    }
                    steps {
                        echo 'Running frontend security scan...'
                        dir('FlashTalk.UI') {
                            sh '''
                                # Check for known vulnerabilities in npm packages
                                npm audit --audit-level=high || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Push Images to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo 'Pushing Docker images to registry...'
                script {
                    docker.withRegistry("https://${REGISTRY}", REGISTRY_CREDENTIALS) {
                        // Push backend image
                        docker.image(env.BACKEND_IMAGE_ID).push("${env.BUILD_NUMBER}")
                        docker.image(env.BACKEND_IMAGE_ID).push("latest")
                        
                        // Push frontend image
                        docker.image(env.FRONTEND_IMAGE_ID).push("${env.BUILD_NUMBER}")
                        docker.image(env.FRONTEND_IMAGE_ID).push("latest")
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                script {
                    // Update Kubernetes deployment with new image tags
                    sh '''
                        # Update deployment YAML with new image tags
                        sed -i "s|flashtalk-api:latest|flashtalk-api:${BUILD_NUMBER}|g" Deployment.yml
                        sed -i "s|flashtalk-ui:latest|flashtalk-ui:${BUILD_NUMBER}|g" Deployment.yml
                        
                        # Apply to staging namespace
                        kubectl apply -f Deployment.yml -n flashtalk-staging
                        
                        # Wait for rollout to complete
                        kubectl rollout status deployment/flashtalk-api -n flashtalk-staging --timeout=300s
                        kubectl rollout status deployment/flashtalk-ui -n flashtalk-staging --timeout=300s
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production environment...'
                input message: 'Deploy to production?', ok: 'Deploy',
                      submitterParameter: 'APPROVER'
                script {
                    // Update Kubernetes deployment with new image tags
                    sh '''
                        # Update deployment YAML with new image tags
                        sed -i "s|flashtalk-api:latest|flashtalk-api:${BUILD_NUMBER}|g" Deployment.yml
                        sed -i "s|flashtalk-ui:latest|flashtalk-ui:${BUILD_NUMBER}|g" Deployment.yml
                        
                        # Apply to production namespace
                        kubectl apply -f Deployment.yml -n flashtalk-production
                        
                        # Wait for rollout to complete
                        kubectl rollout status deployment/flashtalk-api -n flashtalk-production --timeout=300s
                        kubectl rollout status deployment/flashtalk-ui -n flashtalk-production --timeout=300s
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            // Clean up Docker images to save space
            sh '''
                docker image prune -f
                docker system prune -f --volumes
            '''
            
            // Clean workspace
            cleanWs()
        }
        
        success {
            echo 'Pipeline completed successfully!'
            // Send success notification
            script {
                if (env.CHANGE_ID) {
                    // For pull requests
                    pullRequest.comment("✅ Build #${env.BUILD_NUMBER} completed successfully!")
                }
            }
        }
        
        failure {
            echo 'Pipeline failed!'
            // Send failure notification
            script {
                if (env.CHANGE_ID) {
                    // For pull requests
                    pullRequest.comment("❌ Build #${env.BUILD_NUMBER} failed. Please check the logs.")
                }
            }
        }
        
        unstable {
            echo 'Pipeline completed with warnings!'
        }
    }
}