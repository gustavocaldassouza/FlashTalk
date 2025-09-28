#!/bin/bash

# Jenkins Setup Script for FlashTalk Project
# This script helps configure Jenkins with the necessary plugins and tools

set -e

echo "=== FlashTalk Jenkins Setup Script ==="
echo "This script will help you configure Jenkins for the FlashTalk project"
echo ""

# Check if Jenkins CLI is available
if ! command -v jenkins-cli &> /dev/null; then
    echo "❌ Jenkins CLI not found. Please install Jenkins CLI first."
    echo "Download from: http://your-jenkins-url/jnlpJars/jenkins-cli.jar"
    echo "Usage: java -jar jenkins-cli.jar -s http://your-jenkins-url/ -auth username:password"
    exit 1
fi

# Required plugins list
REQUIRED_PLUGINS=(
    "docker-workflow"
    "kubernetes-cli"
    "nodejs"
    "pipeline-stage-view"
    "blueocean"
    "git"
    "workflow-aggregator"
    "build-timeout"
    "timestamper"
    "ws-cleanup"
    "ant"
    "gradle"
    "pipeline-maven"
)

echo "📦 Installing required Jenkins plugins..."
for plugin in "${REQUIRED_PLUGINS[@]}"; do
    echo "Installing plugin: $plugin"
    jenkins-cli install-plugin "$plugin" || echo "⚠️  Failed to install $plugin (may already be installed)"
done

echo ""
echo "🔧 Plugin installation completed!"
echo ""

echo "📋 Manual Configuration Steps:"
echo ""
echo "1. Global Tool Configuration (Manage Jenkins > Global Tool Configuration):"
echo "   - Add .NET SDK:"
echo "     * Name: dotnet-8"
echo "     * Install automatically: Yes"
echo "     * Version: .NET 8.0"
echo ""
echo "   - Add Node.js:"
echo "     * Name: nodejs-18"
echo "     * Install automatically: Yes"
echo "     * Version: NodeJS 18.x"
echo ""

echo "2. Credentials Configuration (Manage Jenkins > Credentials):"
echo "   - Add Docker Registry URL:"
echo "     * Kind: Secret text"
echo "     * ID: docker-registry-url"
echo "     * Secret: your-docker-registry-url (e.g., docker.io)"
echo ""
echo "   - Add Docker Registry Credentials:"
echo "     * Kind: Username with password"
echo "     * ID: docker-registry-credentials"
echo "     * Username: your-docker-username"
echo "     * Password: your-docker-password"
echo ""
echo "   - Add Kubernetes Config (if using K8s deployment):"
echo "     * Kind: Secret file"
echo "     * ID: kubeconfig"
echo "     * File: Upload your kubeconfig file"
echo ""

echo "3. System Configuration (Manage Jenkins > Configure System):"
echo "   - Configure Docker:"
echo "     * Docker URL: unix:///var/run/docker.sock (for local Docker)"
echo "     * Or configure remote Docker daemon URL"
echo ""

echo "4. Create Pipeline Job:"
echo "   - New Item > Pipeline"
echo "   - Name: FlashTalk"
echo "   - Pipeline definition: Pipeline script from SCM"
echo "   - SCM: Git"
echo "   - Repository URL: your-git-repository-url"
echo "   - Branch Specifier: */main"
echo "   - Script Path: Jenkinsfile"
echo ""

echo "5. Branch Configuration (for multi-branch pipeline):"
echo "   - Create Multibranch Pipeline instead"
echo "   - This will automatically detect branches and trigger builds"
echo ""

echo "✅ Setup script completed!"
echo ""
echo "🚀 Next Steps:"
echo "1. Complete the manual configuration steps above"
echo "2. Test the pipeline with a sample build"
echo "3. Configure webhooks in your Git repository for automatic triggering"
echo "4. Set up proper monitoring and alerting"
echo ""
echo "📖 For detailed documentation, see .jenkins/README.md"