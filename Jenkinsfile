pipeline {
    agent any

    environment {
        DOCKER_WORKDIR = '/c/ProgramData/Jenkins/.jenkins/workspace/Cypress_Integration_Docker/cypress-integration-docker/'
        DOCKER_IMAGE = 'owaiskhan216/my-cypress-tests:latest'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Converting the Windows path to Unix path
                    def workspaceUnixPath = "${env.WORKSPACE}".replaceAll('\\\\', '/').replaceAll('C:', '/c')

                    docker.image(DOCKER_IMAGE).inside("-v ${workspaceUnixPath}:${DOCKER_WORKDIR} -w ${DOCKER_WORKDIR}") {
                        sh 'npm install'
                        sh 'npx cypress run'
                    }
                }
            }
        }
    }
    
 }
