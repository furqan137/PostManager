pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = 'shop-sphere-jenkins'
    COMPOSE_FILE = 'docker-compose.yaml'
  }

  stages {
    stage('Clone') {
      steps {
        git url: 'https://github.com/muhammadusmanahmedx/PasswordManager.git', branch: 'main'
      }
    }

    stage('Inject Credentials') {
      environment {
        MONGODB_URI = credentials('MONGODB_URI')
        JWT_SECRET = credentials('JWT_SECRET')
      }
      steps {
        script {
          writeFile file: ".env", text: """
            MONGODB_URI=$MONGODB_URI
            JWT_SECRET=$JWT_SECRET
          """
        }
      }
    }

    stage('Clean up') {
      steps {
        sh '''
          docker-compose -p $COMPOSE_PROJECT_NAME -f $COMPOSE_FILE down --volumes || true
          docker system prune -af || true
          docker volume prune -f || true
        '''
      }
    }

    stage('Build') {
      steps {
        sh 'docker-compose -p $COMPOSE_PROJECT_NAME -f $COMPOSE_FILE build --no-cache'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose -p $COMPOSE_PROJECT_NAME -f $COMPOSE_FILE up -d'
      }
    }
  }

  post {
    always {
      echo '✅ Pipeline finished.'
    }
  }
}
