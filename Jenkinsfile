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
				withCredentials([
					file(credentialsId: 'greencart-backend-env', variable: 'BACKEND_ENV_FILE')
					]) {
				sh '''
				set -eu

				TEST_NETWORK="greencart-ci-${BUILD_NUMBER}"
				BACKEND_CONTAINER="greencart-backend-ci-${BUILD_NUMBER}"
				FRONTEND_CONTAINER="greencart-frontend-ci-${BUILD_NUMBER}"

				cleanup(){
					docker rm -f "$FRONTEND_CONTAINER" >/dev/null 2>&1 || true
					docker rm -f "$BACKEND_CONTAINER" >/dev/null 2>&1 || true
					docker network rm "$TEST_NETWORK" >/dev/null 2>&1 || true
				}

				trap cleanup EXIT

				echo "creating isolated CI test network.."
				docker network create "$TEST_NETWORK" >/dev/null

				echo "Starting newly built backend..."

				docker run -d \
					--name	"$BACKEND_CONTAINER" \
					--network "$TEST_NETWORK" \
					--network-alias backend \
					--env-file "$BACKEND_ENV_FILE" \
					"greencart-backend:${BUILD_NUMBER}"


				echo "Checking new backend health..."

				docker run --rm \
					--network "$TEST_NETWORK" \
					curlimages/curl:8.12.1 \
					-fsS \
					--retry 15 \
					--retry-connrefused \
					--retry-delay 2 \
					--retry-max-time 35 \
					http://backend:4000/health


				echo "Starting newly built frontend.."

				docker run -d \
					--name "$FRONTEND_CONTAINER" \
					--network "$TEST_NETWORK" \
					"greencart-frontend:${BUILD_NUMBER}"

				echo "Checking frontend..."


				docker run --rm \
					--network "$TEST_NETWORK" \
					curlimages/curl:8.12.1 \
					-fsS \
					--retry 10 \
					--retry-connrefused \
					--retry-delay 1 \
					--retry-max-time 20 \
					"http://${FRONTEND_CONTAINER}:80/" \
					>/dev/null

				echo "backend and frontend tests passed"
			'''
			}
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
