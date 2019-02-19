def lenOfMaxPalindrome(string):
    solutionsMap = {} #Allocate an empty hashmap
    #for each possible sublength from 1 to len(string) included
    for sublength in range(1, len(string)+1):
        #for each starting character index from 0 to len(string)-sublength included
        for i in range(len(string) - sublength + 1):
            #find the ending character index
            j = i+ sublength - 1
            #if the sublength is 1 ==> longest palindromic sequence is 1
            if sublength == 1:
                solutionsMap[str(i)+" 1"] = 1
            #else if the length is 2 and the two characters match assign 2
            elif sublength == 2 and string[i] == string[j]:
                solutionsMap[str(i)+" 2"] = 2
            #else if the start and end characters match and the sublength > 2 we need to retrieve
            #the subsolution of the subsequence of the same length-2 starting with index i+1
            elif string[i] == string[j]:
                solutionsMap[str(i)+" "+str(sublength)] = solutionsMap[str(i+1)+" "+str(sublength-2)] + 2
            #else we just carry on the best subsolution from the previous level of sublength-1
            else:
                l_subsolution = solutionsMap[str(i)+" "+str(sublength-1)]
                r_subsolution = solutionsMap[str(i+1)+" "+str(sublength-1)]
                solutionsMap[str(i)+" "+str(sublength)] = max(l_subsolution, r_subsolution);
    #we return the result stored at the root of our tree, which must contain the length of the
    #longest palindromic sequence we were able to find.
    return solutionsMap["0 "+str(len(string))]
print(lenOfMaxPalindrome(input()))
