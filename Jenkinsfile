pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
        CYPRESS_ENV = 'qa'
    }

    stages {
        // // Uncomment this stage if you need to clone the repository
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


       // / Pull and Run Docker Image from Docker Hub
        stage('Run Docker Image from Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKER_HUB_CREDENTIALS') {
                        def app = docker.image('owaiskhan216/my-cypress-tests:latest')
                        app.pull()
                        app.inside('-e CYPRESS_ENV=$CYPRESS_ENV') {
                            sh 'npx cypress run'
                    }
                }
            }
        }
    }
        //   stage('Run Cypress Tests') {
        //           }
    
}

    

    // post {
    //     always {
    //         cleanWs()
    //     }
    // }
}
