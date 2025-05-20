pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.ci.yml'
  }

  stages {
    stage('Checkout Code') {
      steps {
        echo '✅ Checking out source code...'
        checkout scm
      }
    }

    stage('Stop Existing Containers') {
      steps {
        echo '🛑 Stopping existing containers (if any)...'
        sh 'docker compose -f $COMPOSE_FILE down || true'
      }
    }

    stage('Install Node Dependencies') {
      steps {
        echo '📦 Installing Node dependencies inside node:18-alpine container...'
        script {
          // Run npm ci inside a node container, mounting current workspace
          docker.image('node:18-alpine').inside {
            sh 'npm ci'
          }
        }
      }
    }

    stage('Build and Deploy') {
      steps {
        echo '🚀 Building and starting containers with Docker Compose...'
        sh 'docker compose -f $COMPOSE_FILE up -d --build'
      }
    }

    stage('Health Check') {
      steps {
        script {
          echo '🔍 Running health check on http://localhost:3000...'
          def maxRetries = 12
          def success = false
          for (int i = 1; i <= maxRetries; i++) {
            def response = sh(script: "curl -s --max-time 5 http://localhost:3000 || true", returnStatus: true)
            if (response == 0) {
              echo "✅ App is up! (Attempt ${i})"
              success = true
              break
            } else {
              echo "❌ Not up yet (Attempt ${i}). Retrying in 5 seconds..."
              sleep 5
            }
          }
          if (!success) {
            echo "❌ App failed health check after ${maxRetries} attempts"
            echo "📝 Showing container logs to help debug:"
            sh 'docker logs $(docker ps -q -f name=ci-webappdev-nextjs-1) || true'
            error "Health check failed. Deployment aborted."
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deployment successful! App should be running at http://54.147.220.11:3000"
    }
    failure {
      echo "❌ Deployment failed. Please check Jenkins logs above for details."
    }
  }
}

