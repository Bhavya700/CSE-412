OUTPUTS = $(sort $(wildcard outputs/*.txt))
QUESTIONS = $(patsubst outputs/%.txt,%,$(OUTPUTS))
MAKEFILE_PATH = /home/jiaqingchen/hw1
ROOT = $(MAKEFILE_PATH)

all: path $(QUESTIONS)
	rm -rf tmp

%: queries/%.sql
	@echo "checking $@; correct if nothing below ----"
	@psql -A -t -d $(USER) -q -f $< 1> tmp/$@.txt
	@diff outputs/$@.txt tmp/$@.txt || echo "$@ is wrong"; exit 0
	@echo ""

path:
	@mkdir -p tmp

setup_postgres:
	@echo "creating tables"
	psql -d $(USER) -q -f setup_postgres/create_tables.sql
	@echo "importing data"
	psql -d $(USER) -q -c "copy region from '$(ROOT)/TPC-H_data/region.tbl' with delimiter as '|' NULL '';"
	psql -d $(USER) -q -c "copy nation from '$(ROOT)/TPC-H_data/nation.tbl' with delimiter as '|' NULL '';"
	psql -d $(USER) -q -c "copy partsupp from '$(ROOT)/TPC-H_data/partsupp.tbl' with delimiter as '|' NULL '';"
	psql -d $(USER) -q -c "copy customer from '$(ROOT)/TPC-H_data/customer.tbl' with delimiter as '|' NULL '';"
	psql -d $(USER) -q -c "copy lineitem from '$(ROOT)/TPC-H_data/lineitem.tbl' with delimiter as '|' NULL '';"
	psql -d $(USER) -q -c "copy orders from '$(ROOT)/TPC-H_data/orders.tbl' with delimiter as '|' NULL '';"
	psql -d $(USER) -q -c "copy part from '$(ROOT)/TPC-H_data/part.tbl' with delimiter as '|' NULL '';"
	psql -d $(USER) -q -c "copy supplier from '$(ROOT)/TPC-H_data/supplier.tbl' with delimiter as '|' NULL '';"
	@echo "adding relationships"
	psql -d $(USER) -q -f setup_postgres/add_relationships.sql
	@echo "test, count the nation table, the result should be 25"
	psql -d $(USER) -q -c "SELECT count(*) FROM nation;"

clean_postgres:
	psql -d $(USER) -q -f setup_postgres/drop_tables.sql


.PHONY: setup_postgres

