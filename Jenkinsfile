pipeline {
    agent any
    
    stages {    
      stage('build') {
      steps {
        bat 'npm install'
      }
    }

      stage('parallel') {
      parallel {
           stage('tester a') {
          steps {
              
           bat 'npx cypress run --record --key c6a0355c-4706-45df-a0a3-51ff1614022b --parallel'
          }
        }
        stage('tester b') {
          steps {
              
           bat 'npx cypress run --record --key c6a0355c-4706-45df-a0a3-51ff1614022b --parallel'
          }
        }
        
        stage('tester e') {
          steps {
              
           bat 'npx cypress run --record --key c6a0355c-4706-45df-a0a3-51ff1614022b --parallel'
          }
        }
      }

    }
}
}