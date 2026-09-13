pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Backend') {
                    sh 'npm install'
                }
                dir('Frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t movie-backend:latest ./Backend'
                sh 'docker build -t movie-frontend:latest ./Frontend'
            }
        }
    }
}
