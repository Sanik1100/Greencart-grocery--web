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
		stage('Test Greencart Images'){
			steps{
				sh '''
				set -eu
				FRONTEND_CONTAINER="greencart-frontend-ci-${BUILD_NUMBER}"

				cleanup(){
					docker rm -f "$FRONTEND_CONTAINER" >/dev/null 2>&1 || true
				}

				trap cleanup EXIT

				echo "Checking backend health..."

				docker run --rm \
                        --network greencart-network \
                        curlimages/curl:8.12.1 \
                        -fsS http://backend:4000/health

				echo "Starting newly built frontend..."

				docker run -d \
                        --name "$FRONTEND_CONTAINER" \
                        --network greencart-network \
                        "greencart-frontend:${BUILD_NUMBER}"

				echo "Checking frontend..."

				docker run --rm \
			--network greencart-network \
                        curlimages/curl:8.12.1 \
                        -fsS \
			--retry 10 \
			--retry-connrefused \
			--retry-delay 1 \
			--retry-max-time 20 \
			"http://${FRONTEND_CONTAINER}:80/" \
                        >/dev/null

				echo "Frontend test passed!"
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
