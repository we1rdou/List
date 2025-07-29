pipeline {
    agent any

    tools {
        nodejs "Node24" // Asegúrate que este nombre coincida con tu configuración en Jenkins
        dockerTool 'Dockertool' // Cambia el nombre si tu herramienta Docker tiene otro nombre
    }

    stages {
        stage('Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar Pruebas') {
            steps {
                sh 'chmod +x ./node_modules/.bin/jest'
                sh 'npx jest'
            }
        }

        stage('Construir Imagen Docker') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'docker build -t list-app:latest .'
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh '''
                    docker stop list-app || true
                    docker rm list-app || true
                    docker run -d --name list-app -p 3001:3001 list-app:latest
                    To Do List!!!!!
                '''
            }
        }
    }
}