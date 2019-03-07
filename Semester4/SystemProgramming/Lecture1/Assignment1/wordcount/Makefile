CFLAGS=-Wall
.PHONY: all

PROGRAM=wordcount

TIMEOUT=8

TESTS_DIR=tests

TESTS_IN:=$(wildcard $(TESTS_DIR)/*.in)
TESTS:=$(patsubst $(TESTS_DIR)/%.in, %, $(TESTS_IN))

.PHONY: all
all: compile-program check

.PHONY: compile-program

compile-program: $(PROGRAM)

.PHONY: check
check: compile-program $(TESTS_IN)
	@for t in $(TESTS); do \
		echo -n "Running test $$t..." ; \
		./$(PROGRAM) < "$(TESTS_DIR)/$$t.in" > "$$t.out" 2>&1 & \
		prog_pid=$$!; \
		( sleep $(TIMEOUT); kill $$prog_pid > /dev/null 2>&1 ) & \
		killer_pid=$$!; \
		wait $$prog_pid; \
		res=$$?; \
		if test $$res -gt 128; \
		then \
			echo KILLED; \
			rm -f "$$t.out" ;\
		else \
			kill $$killer_pid > /dev/null 2>&1 ;\
			if cmp -s "$$t.out" "$(TESTS_DIR)/$$t.expected"; \
			then \
				echo "PASSED" ;\
				rm -f "$$t.out" ;\
			else \
				echo "FAILED" ;\
				diff "$$t.out" "$(TESTS_DIR)/$$t.expected";\
			fi; \
		fi; \
	done

.PHONY: clean
clean:
	rm -f $(PROGRAM) sample*.out


