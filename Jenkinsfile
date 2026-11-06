pipeline{
	agent any

	stages{
	
		stage('Welcome'){
			steps{
				echo "Starting Greencart CI Pipeline"
			}
			}

		stage('Build Backend Image'){
			steps{
				sh '''
					docker build \
						-t greencart-backend:$BUILD_NUMBER \
						-f backend/Dockerfile \
						backend
				'''
			}
			}

		stage('Build Frontend Image'){
			steps{
				sh '''
				docker build \
					--build-arg VITE_BACKEND_URL= \
					--build-arg VITE_CURRENCY=Rs \
					-t greencart-frontend:$BUILD_NUMBER \
					-f frontend/Dockerfile \
					frontend
				'''
			}
			}
			}

	post{
		success{
			echo 'Both Greencart Docker Images built successfully'
		}
		failure{
			echo 'Greencart CI Pipeline failed.Check Console Output'
		}
		always{
			echo 'Greencart CI Pipeline execution finished.'
		}
		}
		}
