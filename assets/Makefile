RED=\033[0;31m
Green=\033[0;32m
NC=\033[0m
run:
	g++ main.cpp -o main.exe;
	@printf "${Green}Successfully Compiled${NC} \n\n"; 
	@./main.exe < 1.in > temp.txt;
	@diff -Z -B temp.txt 1.out; \
    RETVAL=$$?; \
    if [ $$RETVAL -eq 0 ]; then \
        printf "${Green}Test Case 1 Passed${NC} \n\n"; \
	else \
        printf "${RED}Test Case 1 Failed${NC} \n\n"; \
    fi
	@./main.exe < 2.in > temp.txt
	@diff -Z -B temp.txt 2.out; \
    RETVAL=$$?; \
    if [ $$RETVAL -eq 0 ]; then \
        printf "${Green}Test Case 2 Passed${NC} \n\n"; \
	else \
        printf "${RED}Test Case 2 Failed${NC} \n\n"; \
    fi