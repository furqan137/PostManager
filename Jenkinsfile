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

stage('Build and Deploy') {
  steps {
    echo '🚀 Building and starting containers...'
    sh 'docker compose -f $COMPOSE_FILE up -d --build'
  }
}

    stage('Health Check') {
      steps {
        echo '🔍 Running health check on http://localhost:3000...'
        sh '''
          for i in {1..5}; do
            if curl -s --max-time 5 http://localhost:3000 > /dev/null; then
              echo "✅ App is up!"
              exit 0
            else
              echo "❌ Not up yet. Retrying in 5 seconds..."
              sleep 5
            fi
          done
          echo "❌ App failed health check"
          exit 1
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Deployment successful! App should be running at http://34.230.89.192:3000"
    }
    failure {
      echo "❌ Deployment failed. Please check Jenkins logs."
    }
  }
}
