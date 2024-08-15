pipeline {
    agent {
        docker {
            image 'owaiskhan216/my-cypress-tests:latest'
            args '-v "C:/ProgramData/Jenkins/.jenkins/workspace/Cypress_Integration_Docker/cypress-integration-docker:/workspace" -w "/workspace"'
        }
    }
    stages {
        stage('Run Cypress Tests') {
            steps {
                script {
                    docker.image('owaiskhan216/my-cypress-tests:latest').inside('-v "C:/ProgramData/Jenkins/.jenkins/workspace/Cypress_Integration_Docker/cypress-integration-docker:/workspace" -w "/workspace"') {
                        sh 'cmd.exe'
                    }
                }
            }
        }
    }
}
