SHELL:=/bin/bash

error:
	@echo "Please choose one of the following target: setup, backup, restore"

setup:
	sudo apt-get install -y emacs
# "noninteractive" prevents any password prompts from mysql
# -y automatically puts in 'yes' for any prompts
	@read -n 1 -s -r -p "Please set no default password for root on the following two prompts. Press any key to continue..."
	sudo apt-get install -y mysql-server
	sudo mysql < $(CURDIR)/Prototype/database/db_setup.sql
	$(MAKE) restore
backup:	
	sudo mysqldump test > $(CURDIR)/Prototype/database/backup.sql

restore:
	sudo mysql test < $(CURDIR)/Prototype/database/backup.sql