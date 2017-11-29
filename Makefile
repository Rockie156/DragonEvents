error:
	@echo "Please choose one of the following target: setup, backup, restore"

setup:
	sudo apt-get install emacs
# "noninteractive" prevents any password prompts from mysql
# -y automatically puts in 'yes' for any prompts
	sudo apt-get install -y mysql-server
backup:	
	sudo mysqldump test > $(CURDIR)/Prototype/database/backup.sql

restore:
	sudo mysql test < $(CURDIR)/Prototype/database/backup.sql