error:
	@echo "Please choose one of the following target: setup, backup, restore"

setup:
	sudo apt-get install emacs
	@echo "sudo debconf-set-selections <<< 'mysql-server mysql-server/password password'"
	@echo "sudo debconf-set-selections <<< 'mysql-server mysql-server/password password'"
	sudo apt-get -y install mysql-server


backup:	
	sudo mysqldump test -p > $(CURDIR)/Prototype/database/backup.sql

restore:
	sudo mysql -p test < $(CURDIR)/Prototype/database/backup.sql