def longestPalyndrome(string):
    solutionsMap = {}
    for i in range(len(string)):
        solutionsMap[str(i)*2] = 1
    for sublength in range(2, len(string)+1):
        for i in range(len(string) - sublength + 1):
            j = i+ sublength - 1
            if sublength == 2 and string[i] == string[j]:
                solutionsMap[str(i)+str(j)] = 2
            elif string[i] == string[j]:
                solutionsMap[str(i)+str(j)] = solutionsMap[str(i+1)+str(j-1)] + 2
            else:
                l_subsolution = solutionsMap[str(i)+str(j-1)]
                r_subsolution = solutionsMap[str(i+1)+str(j)]
                solutionsMap[str(i)+str(j)] = max(l_subsolution, r_subsolution);
    return solutionsMap["0"+str(len(string)-1)]
print(longestPalyndrome(input()))
