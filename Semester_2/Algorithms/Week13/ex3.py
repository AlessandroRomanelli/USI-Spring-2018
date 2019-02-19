string = input()
# string = ""
# with open('word.txt') as f:
#     data = f.read()
#     string = data

def longestPalyndrome(string):
    if len(string) < 2:
        return len(string)

    best = 1
    for i in range(len(string)):
        count = 1
        j = i-1
        k = i+1
        if j > 0 and string[i] == string[j]:
            k = i
            count = 0
            while j >= 0 and k < len(string):
                if string[j] == string[k]:
                    count+=2
                    j-=1
                    k+=1
                else:
                    j=-1
        elif k < len(string) and string[i] == string[k]:
            j = i
            count = 0
            while j >= 0 and k < len(string):
                if string[j] == string[k]:
                    count+=2
                    j-=1
                    k+=1
                else:
                    j=-1
        else:
            while j >= 0 and k < len(string):
                if string[j] == string[k]:
                    count+=2
                    j-=1
                    k+=1
                else:
                    j=-1
        # print("Current index: " + str(i) + ", got: "+ str(count))
        if count > best:
            best = count
    return best

print(longestPalyndrome(string))
