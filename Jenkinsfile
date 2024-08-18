pipeline {
    agent any

    // environment {
    //     DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
    //     CYPRESS_ENV = 'qa'
    // }

    stages {
        // Uncomment this stage if you need to clone the repository
        // stage('Clone Repository') {
        //     steps {
        //         git url: 'https://github.com/owais2021/cypress-docker-pipeline.git', branch: 'master'
        //     }
        // }

        //  stage('Build Docker Image') {
        //     steps {
        //         script {
        //             docker.build('owaiskhan216/my-cypress-tests:latest')
        //         }
        //     }
        // }

        // stage('Push Docker Image to Docker Hub') {
        //     steps {
        //         script {
        //             docker.withRegistry('https://index.docker.io/v1/', 'DOCKER_HUB_CREDENTIALS') {
        //                 docker.image('owaiskhan216/my-cypress-tests:latest').push('latest')
        //             }
        //         }
        //     }
        // }

        stage('Run Cypress Tests') {
            steps {
           script {
                    // Jenkins workspace path as-is (Windows-style)
                    def workspacePath = "${env.WORKSPACE}"

                    // Construct the Docker volume and working directory parameters
                    def dockerVolume = "-v ${workspacePath}:${workspacePath}"
                    def dockerWorkdir = "-w ${workspacePath}"

                    // Run Cypress tests inside the Docker container
                    docker.image('owaiskhan216/my-cypress-tests:latest').inside("${dockerVolume} ${dockerWorkdir}") {
                        bat 'npx cypress run'
                    }
                }
            }
        }
    }

    //  post {
    //      always {
    //          cleanWs()
    //      }
    //  }
}
