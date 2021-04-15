RED=\033[0;31m
Green=\033[0;32m
NC=\033[0m
Blue=\033[1;34m
Grey=\033[0;37m
run: noConfig;
cpp:
	g++ main.cpp -o main.exe -std=gnu++11;
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
py:
	@python main.py < 1.in > temp.txt;
	@diff -Z -B temp.txt 1.out; \
    RETVAL=$$?; \
    if [ $$RETVAL -eq 0 ]; then \
        printf "${Green}Test Case 1 Passed${NC} \n\n"; \
	else \
        printf "${RED}Test Case 1 Failed${NC} \n\n"; \
    fi
	@python main.py < 1.in > temp.txt;
	@diff -Z -B temp.txt 2.out; \
    RETVAL=$$?; \
    if [ $$RETVAL -eq 0 ]; then \
        printf "${Green}Test Case 2 Passed${NC} \n\n"; \
	else \
        printf "${RED}Test Case 2 Failed${NC} \n\n"; \
    fi
noConfig:
	@printf "${RED}Default Language Not Configured${NC} \n\n${Blue}Run : rktcp init${Grey}\nTo choose your default language...";