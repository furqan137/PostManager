pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
    MONGO_URI = credentials('MONGO_URI') // Your Jenkins Credential ID
  }

  stages {
    stage('Checkout Code') {
      steps {
        echo '✅ Checking out source code...'
        checkout scm
      }
    }

    stage('Inject Mongo URI') {
      steps {
        echo '🔐 Injecting MongoDB URI into .env.local...'
        sh '''
          echo "MONGO_URI=${MONGO_URI}" > .env.local
          cat .env.local
        '''
      }
    }

    stage('Stop Existing Containers') {
      steps {
        echo '🛑 Stopping existing containers (if any)...'
        sh 'docker compose -f $COMPOSE_FILE down || true'
      }
    }

    stage('Build and Deploy') {
      steps {
        echo '🚀 Building and starting containers...'
        sh 'docker compose -f $COMPOSE_FILE up -d --build'
      }
    }

    stage('Health Check') {
      steps {
        script {
          echo '🔍 Running health check on http://localhost:5100...'
          def maxRetries = 12
          def success = false
          for (int i = 1; i <= maxRetries; i++) {
            def response = sh(script: "curl -s --max-time 5 http://localhost:5100 || true", returnStatus: true)
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
            sh 'docker logs ci-webappdev-nextjs-1 || true'
            error "Health check failed. Deployment aborted."
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deployment successful! App should be running at http://<EC2-IP>:5100"
    }
    failure {
      echo "❌ Deployment failed. Please check Jenkins logs above for details."
    }
  }
}
