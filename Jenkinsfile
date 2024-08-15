pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
        CYPRESS_ENV = 'qa'
    }

    stages {
        // Uncomment this stage if you need to clone the repository
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

        stage('Run Cypress Tests') {
         steps {
                script {
                    // Replace backslashes with forward slashes for compatibility
                    def workspacePath = "${env.WORKSPACE}".replace('\\', '/')
                    // Convert Windows paths to Docker-friendly paths
                    workspacePath = workspacePath.replace('C:/', '/c/')

                    // Specify the Docker image and pass the corrected path
                    docker.image('owaiskhan216/my-cypress-tests:latest').inside("-v ${workspacePath}:/workspace -w /workspace") {
                        sh 'npx cypress run'
                    }
                }
            }






            // steps {
            //     script {
            //         def workspacePath = "${env.WORKSPACE}".replace('\\', '/')
            //         docker.image('owaiskhan216/my-cypress-tests:latest').inside("-v ${workspacePath}:/workspace -w /workspace") {
            //             sh 'npx cypress run'
            //         }
            //     }
            // }






        }
    }

    // post {
    //     always {
    //         cleanWs()
    //     }
    // }
}
