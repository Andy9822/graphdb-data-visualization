services-up:
	docker-compose up -d
	sleep 16
	-open http://localhost:7474/browser/
	-xdg-open http://localhost:7474/browser/

services-down:
	docker-compose down