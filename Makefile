services-up:
	docker-compose up -d
	echo "Running Neo4j Browser on http://localhost:7474/browser/"

services-down:
	docker-compose down