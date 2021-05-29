PROJECT_PATH := ./
API_PATH := ./api

install:
	@yarn install --prefix $(PROJECT_PATH)
	@yarn install --prefix $(API_PATH)

services-up:
	docker-compose up -d
	sleep 16
	-open http://localhost:7474/browser/
	-xdg-open http://localhost:7474/browser/

services-down:
	docker-compose down