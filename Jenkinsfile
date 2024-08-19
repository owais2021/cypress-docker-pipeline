pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
        CYPRESS_ENV = 'stage'
    }


    stages {
        // // Uncomment this stage if you need to clone the repository
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/owais2021/cypress-docker-pipeline.git', branch: 'master'
            }
        }

         stage('Build Docker Image') {
            steps {
                script {
                    docker.build('owaiskhan216/my-cypress-tests:latest')
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKER_HUB_CREDENTIALS') {
                        docker.image('owaiskhan216/my-cypress-tests:latest').push('latest')
                    }
                }
            }
        }


       // / Pull and Run Docker Image from Docker Hub
       stage('Run Cypress Tests') {
            steps {
                script {
                    def workspacePath = "${env.WORKSPACE}".replace('\\', '/').replace('C:', '/c')
                    
                    // Pull the Docker image
                    powershell """
                        docker pull owaiskhan216/my-cypress-tests:latest
                    """

                    // Run the Cypress tests inside the Docker container
                    powershell """
                        docker run --rm `
                        -e CYPRESS_ENV=${CYPRESS_ENV} `
                        -v ${workspacePath}:${workspacePath} `
                        -w ${workspacePath} `
                        owaiskhan216/my-cypress-tests:latest `
                        npx cypress run
                    """
                }
            }
        }

    }

    

    post {
        always {
            cleanWs()
        }
    }
}
