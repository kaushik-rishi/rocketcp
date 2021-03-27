#Placing input and output files in arrays
mapfile -t inputs < <(ls *in*txt)
mapfile -t outputs < <(ls *out*txt)

#creating executable file
g++ test.cpp -o executable

#running test cases
len=${#inputs[@]}
for (( i = 0 ; i < len ; i++))
do
    #piping output into ans.txt
    ./executable < "${inputs[$i]}" > ans.txt
    #Difference Check
    x=$(diff -Z -B ans.txt "${outputs[$i]}")
    if [[ $x ]]
        then
            echo $x 
            echo "Test case-$[i+1] Failed"
        else
            echo "Test case-$[i+1] Passed"
    fi
    rm -f ans.txt
done
